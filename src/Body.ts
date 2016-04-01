import SortedList, {SortedListDirection, SortedListEvents} from "ts-core/lib/Data/SortedList";
import ActiveModel from "ts-data/lib/Model/ActiveModel";
import View from "./View";
import List from "ts-core/lib/Data/List";
import Dictionary from "ts-core/lib/Data/Dictionary";
import ModelCollection from "ts-core/lib/Data/ModelCollection";
import {CollectionEvents, CollectionOperationInterface} from "ts-core/lib/Data/Collection";
import EventEmitter from "ts-core/lib/Events/EventEmitter";
import {default as Column, COLUMN_EVENTS} from "./Column";
import Row, {RowInterface, ROW_EVENTS} from "./Row";
import Cell from "./Cell";
import Grid, {GRID_EVENTS} from "./Grid";
import {callByNeed} from "./utils";
import Command from "./Command";
import * as _ from "underscore";

export const BODY_EVENTS = {
    CHANGED_ROW: 'body:changedRow',
    CHANGED_CELL: 'body:changedCell'
};

export interface GridPosition {
    model:ActiveModel,
    column:Column
}

export interface BodyDelegateInterface {
    bodyDefaultSortPredicateForModels(body:Body):any;
    bodyDefaultSortDirectionForModels(body:Body):SortedListDirection;
    bodyModelForEmptyRow(body:Body):ActiveModel;
    bodyPrimaryKeyForModels(body:Body):any;
    bodyBeforeCreateModel(body:Body, model:ActiveModel):void;
    bodyCreateModel(body:Body, model:ActiveModel):ng.IPromise<ActiveModel>;
    bodyAfterCreateModel(body:Body, model:ActiveModel):void;
    bodyValidateModel(body:Body, model:ActiveModel):boolean;
    bodyShouldUpdateModel(body:Body, model:ActiveModel):boolean;
    bodyUpdateModel(body:Body, model:ActiveModel):ng.IPromise<ActiveModel>;
    bodyAfterUpdateModel(body:Body, model:ActiveModel):void;
}

export class Body extends View {

    public tagName:string = 'div';

    public className:string = 'ts-grid-body';

    public activePosition:GridPosition;

    public activeRow:Row;

    public activeCell:Cell;

    /**
     * A list with Column definitions
     */
    public columns:List<Column>;

    public cols:List<JQuery> = new List<JQuery>();

    public rowType:RowInterface = Row;

    public rows:List<Row>;

    public models:SortedList<ActiveModel>;

    public rowsByModelId:Dictionary<any, Row> = new Dictionary<any, Row>();

    public collection:ModelCollection<ActiveModel>;

    public emptyRow:Row;

    public _grid:Grid;

    public $table:JQuery;

    public $tbody:JQuery;

    public $colgroup:JQuery;

    protected _delegate:BodyDelegateInterface;

    public events:EventEmitter = new EventEmitter();

    public constructor(delegate:BodyDelegateInterface, columns:List<Column>, collection:ModelCollection<ActiveModel>, rowType:RowInterface = Row) {

        super();

        this._delegate = delegate;

        this.columns = columns;

        this.collection = collection;

        this.rowType = rowType;

        this.initialize();
    }

    /**
     * Initializer.
     */
    public initialize() {

        super.initialize();

        this.rows = new List<Row>();

        var models = this.collection.all();
        this.models = new SortedList<ActiveModel>(models, this._delegate.bodyPrimaryKeyForModels(this));

        this.models.setSortPredicate(this._delegate.bodyDefaultSortPredicateForModels(this), this._delegate.bodyDefaultSortDirectionForModels(this));
        this.rowsByModelId.clear();
        this.models.each(model => {

            var row = new this.rowType(
                this.columns,
                model
            );
            this.rowsByModelId.set(model.getId(), row);
            this.rows.add(row);
        });

        this.collection.events.on(CollectionEvents.ADD, evt => this.addModels(evt));
        this.collection.events.on(CollectionEvents.REMOVE, evt => this.removeModels(evt));
        this.models.events.on(SortedListEvents.ADD, evt => this.addRows(evt));
        this.models.events.on(SortedListEvents.REMOVE, evt => this.removeRows(evt));
        this.models.events.on(SortedListEvents.SORT, evt => this.sortRows(evt));

        this.columns.each(column => {
            column.events.on(COLUMN_EVENTS.CHANGED_WIDTH, e => this.columnChangedWidth(e));
        });
    }

    protected columnChangedWidth(e) {

        var column = e.params.column;
        var columnIndex = this.columns.indexOf(column);

        var col = this.cols.get(columnIndex);

        if (col) {
            col.width(column.getWidth());
        }
    }

    public getDelegate() {
        return this._delegate;
    }

    protected addModels(evt) {

        var operations:CollectionOperationInterface<ActiveModel>[] = evt.params.operations;


        _.each(operations, operation => {

            //console.log(`add item '${operation.item.get('title')}' from models, collectionIndex: '${operation.index}', modelsIndex: '${this.models.indexOf(operation.item)}'`);

            this.models.add(operation.item);
        });
    }

    protected removeModels(evt) {

        var operations:CollectionOperationInterface<ActiveModel>[] = evt.params.operations;

        _.each(operations, operation => {

            //console.log(`remove item '${operation.item.get('title')}' from models, collectionIndex: '${operation.index}', modelsIndex: '${this.models.indexOf(operation.item)}'`);

            this.models.remove(operation.item);
        });
    }

    /**
     * This will set the Grid instance and attaches
     * the right event(s) on it
     * @param grid
     */
    public setGrid(grid:Grid) {
        this._grid = grid;
        grid.events.on(GRID_EVENTS.EDITED, this.moveToNextCell, this);
        grid.events.on(GRID_EVENTS.NAVIGATE, this.moveToNextCell, this);
        grid.events.on(GRID_EVENTS.CLICK, this.moveToCell, this);
    }

    /**
     * Get the Body's Grid instance.
     * @returns {Grid}
     */
    public getGrid():Grid {
        return this._grid;
    }

    protected prependEmptyRow() {

        this.emptyRow = new this.rowType(
            this.columns,
            this._delegate.bodyModelForEmptyRow(this)
        );

        this.emptyRow.events.on(ROW_EVENTS.CHANGED, e => this.emptyRowDidChange(e));

        this.rows.prepend(this.emptyRow);

        this.insertRow(this.emptyRow);
    }

    protected removeEmptyRow() {

        if (this.emptyRow) {
            this.rows.remove(this.emptyRow);
            this.emptyRow.remove();
        }
    }

    protected emptyRowDidChange(e) {

        var row = e.params.row;
        row.valid = this._delegate.bodyValidateModel(this, row.model);
    }

    /**
     * This method can be called either directly or with a certain index.
     * @param model
     * @param index
     * @param items
     */
    public addRow(model:ActiveModel, index?:number, items?:ModelCollection<ActiveModel>) {

        // addRow() is called directly
        if (_.isUndefined(items)) {
            this.collection.add(model);
            return;
        }

        var row = new this.rowType(
            this.columns,
            model
        );

        this.rowsByModelId.set(model.getId(), row);

        this.rows.add(row);

        this.insertRow(row);
    }

    protected insertRow(row:Row) {

        var index = this.rows.indexOf(row);

        var $children = this.$tbody.children();
        var $rowEl = row.render().$el;

        if (index >= $children.length) {
            this.$tbody.append($rowEl);
        }
        else {
            $children.eq(index).before($rowEl);
        }
    }

    /**
     * This method can be called as a callback to a TSCore.Data.Collection#add event.
     * @param evt
     */
    public addRows(evt) {

        var operations:CollectionOperationInterface<ActiveModel>[] = evt.params.operations;

        _.each(operations, operation => {
            this.addRow(operation.item, operation.index, this.collection);
        });
    }

    /**
     * This method can be called as a callback to a TSCore.Data.Collection#remove event.
     * @param evt
     */
    public removeRows(evt) {

        var operations:CollectionOperationInterface<ActiveModel>[] = evt.params.operations;

        // First gather row objects, when we delete directly indexes
        // won't be correct
        var rows = _.map(operations, operation => {
            return this.rows.get(operation.index);
        });

        // After that apply remove operation to each of them
        _.each(rows, row => {
            row.remove();
            this.rows.remove(row);
        });
    }

    /**
     * Remove row by model
     * @param model Model instance to remove
     * @returns {Body}
     * @chainable
     */
    public removeRow(model:ActiveModel) {

        this.collection.remove(model);

        return this;
    }

    public sortRows(e) {

        this.deactivateCell();
        this.rows.clear();
        this.$tbody.children().detach();
        this.models.each(model => {
            var row = this.rowsByModelId.get(model.getId());

            this.rows.add(row);
            this.$tbody.append(row.$el);
        });
    }

    public refresh(evt) {

        var grid = this.getGrid();

        this.rows.each(row => {
            row.remove();
        });

        this.rows = new List<Row>();
        this.rowsByModelId.clear();

        this.models.each(model => {
            var row = new this.rowType(
                this.columns,
                model
            );
            this.rowsByModelId.set(model.getId(), row);
            this.rows.add(row);
        });

        this.render();
        grid.events.trigger(GRID_EVENTS.REFRESH, {body: this});
    }

    /**
     * Renders all the rows inside this body.
     * @returns {Body}
     * @chainable
     */
    public render():this {

        var grid = this.getGrid();

        this.$el.empty();

        this.$table = $('<table />');
        this.$tbody = $('<tbody />');
        this.$colgroup = $('<colgroup />');
        this.cols.clear();
        this.columns.each(column => {
            var $col = $('<col />');
            $col.css('width', column.getWidth());
            this.$colgroup.append($col);
            this.cols.add($col);
        });
        this.$table.append(this.$colgroup);
        this.$table.append(this.$tbody);
        this.rows.each(row => {
            this.$tbody.append(row.render().$el);
        });

        this.$table.attr('width', grid.getInnerWidth());

        this.$el.append(this.$table);

        this.delegateEvents();

        return this;
    }

    public remove():this {
        this.rows.each(function (row) {
            row.remove.apply(row, arguments);
        });
        super.remove();
        return this;
    }

    public getActiveCell() {

        var model:ActiveModel = this.activePosition.model;
        var column:Column = this.activePosition.column;

        return this.getCell(model, column);
    }

    public getCell(model:ActiveModel, column:Column):Cell {

        var row = this.rows.whereFirst({modelId: model.getId()});
        var i = this.rows.indexOf(row);
        var j = this.columns.indexOf(column);

        return this.rows.get(i).cells.get(j);
    }

    public moveToCell(evt) {

        var model:ActiveModel = evt.params.model;
        var row = this.rows.whereFirst({modelId: model.getId()});
        var column:Column = evt.params.column;
        var cell = this.getCell(model, column);

        this.activate(row, cell);
    }

    protected deactivateCell() {

        if (this.activeRow) {
            this.activeRow.setActive(false);
        }

        if (this.activeCell) {
            this.activeCell.deactivate();
        }
    }

    protected activate(row:Row, cell:Cell) {

        if (this.beforeActivateCell(cell.column, row.model) === false) {
            return;
        }

        if (cell.column.getEditable() === false) {
            return;
        }

        if (this.activeRow !== row) {
            var oldRow = this.activeRow;
            this.activeRow = row;
            this.changedRow(oldRow, row);
        }

        if (this.activeCell !== cell) {
            var oldCell = this.activeCell;
            if (this.activeCell) {
                this.activeCell.deactivate();
            }
            this.activeCell = cell;
            this.changedCell(oldCell, cell);
        }

        if (cell.isActivated()) {
            cell.enterEditMode();
        } else {
            cell.activate();
        }
    }

    protected changedRow(fromRow:Row, toRow:Row) {

        if (fromRow) {
            fromRow.setActive(false);
        }

        if (toRow) {
            toRow.setActive(true);
        }

        if (fromRow && fromRow !== this.emptyRow) {

            fromRow.valid = this._delegate.bodyValidateModel(this, fromRow.model);

            var shouldUpdate = this._delegate.bodyShouldUpdateModel(this, fromRow.model);

            if (fromRow.valid && shouldUpdate) {

                fromRow.setLoading(true);
                this._delegate.bodyUpdateModel(this, fromRow.model).then(model => {
                    fromRow.setLoading(false);
                    this._delegate.bodyAfterUpdateModel(this, fromRow.model);
                });
            }
        }

        if (fromRow && fromRow === this.emptyRow && this.emptyRow.valid) {
            var rowModel = this.emptyRow.model;
            this._delegate.bodyBeforeCreateModel(this, rowModel);
            this.emptyRow.setLoading(true);
            this._delegate.bodyCreateModel(this, rowModel).then(model => {
                this.emptyRow.setLoading(false);
                this.models.add(model);
                this._delegate.bodyAfterCreateModel(this, model);
                this.focusEmptyRow();
            });
        }

        this.events.trigger(BODY_EVENTS.CHANGED_ROW, {fromRow: fromRow, toRow: toRow});
    }

    protected focusEmptyRow() {
        this.activeRow = null;
        this.activeCell = null;
        var row = this.rows.get(0);
        var cell = row.cells.get(0);
        this.activate(row, cell);
    }

    protected changedCell(fromCell:Cell, toCell:Cell) {

        this.events.trigger(BODY_EVENTS.CHANGED_CELL, {fromCell: fromCell, toCell: toCell});
    }

    /**
     * Move to next cell based on event
     * @param evt
     * @returns {Body}
     * @chainable
     */
    public moveToNextCell(evt) {

        var grid = this.getGrid();
        var model = evt.params.model;
        var column = evt.params.column;
        var cmd:Command = evt.params.command;
        var cell, renderable, editable, m, n;

        var row = this.rows.whereFirst({modelId: model.id});

        var i = this.rows.indexOf(row);
        var j = this.columns.indexOf(column);

        if (j === -1) return this;

        if (cmd.enter() || cmd.esc() || cmd.blur()) {

            if (this.activeCell.editModeActive) {
                this.activeCell.exitEditMode();
                this.activeCell.activate();
            }
        }

        if (cmd.enter() || cmd.left() || cmd.right() || cmd.up() || cmd.down() || cmd.shiftTab() || cmd.tab()) {
            var l = this.columns.length;
            var maxOffset = l * this.rows.length;

            if (cmd.up() || cmd.down() || cmd.enter()) {
                m = i + (cmd.up() ? -1 : 1);

                var row = this.rows.get(m);
                if (row) {
                    cell = row.cells.get(j);
                    if (callByNeed(cell.column.getEditable(), cell.column, model)) {
                        this.activate(row, cell);
                        grid.events.trigger(GRID_EVENTS.NEXT, {
                            row: m,
                            column: j,
                            outside: false
                        });
                    }
                }
                else {

                    grid.events.trigger(GRID_EVENTS.NEXT, {
                        row: m,
                        column: j,
                        outside: true
                    });
                }
            }
            else if (cmd.left() || cmd.right() || cmd.shiftTab || cmd.tab()) {

                var right = cmd.right() || cmd.tab();
                for (var offset = i * l + j + (right ? 1 : -1);
                     offset >= 0 && offset < maxOffset;
                     right ? offset++ : offset--) {
                    m = ~~(offset / l);
                    n = offset - m * l;
                    cell = this.rows.get(m).cells.get(n);
                    renderable = callByNeed(cell.column.getRenderable(), cell.column, cell.model);
                    editable = callByNeed(cell.column.getEditable(), cell.column, model);

                    if (renderable && editable) {
                        this.activate(row, cell);
                        grid.events.trigger(GRID_EVENTS.NEXT, {
                            row: m,
                            column: n,
                            outside: false
                        });
                        break;
                    }
                }

                if (offset == maxOffset) {
                    grid.events.trigger(GRID_EVENTS.NEXT, {
                        row: ~~(offset / l),
                        column: offset - m * l,
                        outside: true
                    });
                }
            }
        }

        return this;
    }

    protected beforeActivateCell(column:Column, model:ActiveModel):boolean {
        return true;
    }
}
