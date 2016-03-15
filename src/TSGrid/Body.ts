///<reference path="Command.ts"/>
///<reference path="CommandTypes.ts"/>

module TSGrid {

    export interface GridPosition {
        model: TSCore.App.Data.Model.ActiveModel,
        column: TSGrid.Column
    }

    export interface IBodyDelegate {
        bodyModelForEmptyRow(body: TSGrid.Body): TSCore.App.Data.Model.ActiveModel;
        bodyPrimaryKeyForModels(body: TSGrid.Body): any;
        bodyBeforeCreateModel(body: TSGrid.Body, model: TSCore.App.Data.Model.ActiveModel): void;
        bodyCreateModel(body: TSGrid.Body, model: TSCore.App.Data.Model.ActiveModel): ng.IPromise<TSCore.App.Data.Model.ActiveModel>;
        bodyAfterCreateModel(body: TSGrid.Body, model: TSCore.App.Data.Model.ActiveModel): void;
        bodyValidateModel(body: TSGrid.Body, model: TSCore.App.Data.Model.ActiveModel): boolean;
        bodyShouldUpdateModel(body: TSGrid.Body, model: TSCore.App.Data.Model.ActiveModel): boolean;
        bodyUpdateModel(body: TSGrid.Body, model: TSCore.App.Data.Model.ActiveModel): ng.IPromise<TSCore.App.Data.Model.ActiveModel>;
        bodyAfterUpdateModel(body: TSGrid.Body, model: TSCore.App.Data.Model.ActiveModel): void;
    }

    export class Body extends TSCore.App.UI.View {

        public tagName:string = 'div';

        public className:string = 'ts-grid-body';

        public activePosition:GridPosition;

        public activeRow:Row;

        public activeCell:Cell;

        /**
         * A list with Column definitions
         */
        public columns:TSCore.Data.List<Column>;

        public rowType:IRow = Row;

        public rows:TSCore.Data.List<Row>;

        public models:TSCore.Data.SortedList<TSCore.App.Data.Model.ActiveModel>;

        public collection:TSCore.Data.ModelCollection<TSCore.App.Data.Model.ActiveModel>;

        public emptyRow:Row;

        public _grid:Grid;

        protected _delegate:IBodyDelegate;

        public events: TSCore.Events.EventEmitter = new TSCore.Events.EventEmitter();

        public constructor(delegate:IBodyDelegate, columns:TSCore.Data.List<Column>, collection:TSCore.Data.ModelCollection<TSCore.App.Data.Model.ActiveModel>, rowType:IRow = TSGrid.Row) {

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

            this.rows = new TSCore.Data.List<Row>();

            var models = this.collection.all();
            this.models = new TSCore.Data.SortedList<TSCore.App.Data.Model.ActiveModel>(models, this._delegate.bodyPrimaryKeyForModels(this));

            this.models.resort();
            this.models.each(model => {

                this.rows.add(new this.rowType(
                    this.columns,
                    model
                ));
            });

            this.prependEmptyRow();

            this.collection.events.on(TSCore.Data.CollectionEvents.ADD, evt => this.addModels(evt));
            this.collection.events.on(TSCore.Data.CollectionEvents.REMOVE, evt => this.removeModels(evt));
            this.models.events.on(TSCore.Data.SortedListEvents.ADD, evt => this.insertRows(evt));
            this.models.events.on(TSCore.Data.SortedListEvents.REMOVE, evt => this.removeRows(evt));
            this.models.events.on(TSCore.Data.SortedListEvents.SORT, evt => this.refresh(evt));
        }

        public defaultSortPredicate(): any {
            return this._delegate.bodyPrimaryKeyForModels(this);
        }

        protected addModels(evt) {

            var operations:TSCore.Data.ICollectionOperation<TSCore.App.Data.Model.ActiveModel>[] = evt.params.operations;


            _.each(operations, operation => {

                console.log(`add item '${operation.item.get('title')}' from models, collectionIndex: '${operation.index}', modelsIndex: '${this.models.indexOf(operation.item)}'`);

                this.models.add(operation.item);
            });
        }

        protected removeModels(evt) {

            var operations:TSCore.Data.ICollectionOperation<TSCore.App.Data.Model.ActiveModel>[] = evt.params.operations;

            _.each(operations, operation => {

                console.log(`remove item '${operation.item.get('title')}' from models, collectionIndex: '${operation.index}', modelsIndex: '${this.models.indexOf(operation.item)}'`);

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
            grid.events.on(TSGrid.TSGridEvents.EDITED, this.moveToNextCell, this);
            grid.events.on(TSGrid.TSGridEvents.NAVIGATE, this.moveToNextCell, this);
            grid.events.on(TSGrid.TSGridEvents.CLICK, this.moveToCell, this);
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

            this.emptyRow.events.on(TSGrid.RowEvents.CHANGED, e => this.emptyRowDidChange(e));

            this.rows.prepend(this.emptyRow);
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
        public insertRow(model:TSCore.App.Data.Model.ActiveModel, index?:number, items?:TSCore.Data.ModelCollection<TSCore.App.Data.Model.ActiveModel>) {

            // insertRow() is called directly
            if (_.isUndefined(items)) {
                this.collection.add(model);
                return;
            }

            var row = new this.rowType(
                this.columns,
                model
            );

            this.rows.add(row);

            index = this.rows.indexOf(row);

            var $tbody = this.$el.find('tbody');

            var $children = $tbody.children();
            var $rowEl = row.render().$el;

            if (index >= $children.length) {
                $tbody.append($rowEl);
            }
            else {
                $children.eq(index).before($rowEl);
            }
        }

        /**
         * This method can be called as a callback to a TSCore.Data.Collection#add event.
         * @param evt
         */
        public insertRows(evt) {

            var operations:TSCore.Data.ICollectionOperation<TSCore.App.Data.Model.ActiveModel>[] = evt.params.operations;

            console.log('insertRows', operations);

            _.each(operations, operation => {
                this.insertRow(operation.item, operation.index, this.collection);
            });
        }

        /**
         * This method can be called as a callback to a TSCore.Data.Collection#remove event.
         * @param evt
         */
        public removeRows(evt) {

            var operations:TSCore.Data.ICollectionOperation<TSCore.App.Data.Model.ActiveModel>[] = evt.params.operations;

            console.log('removeRows', operations);

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
         * @returns {TSGrid.Body}
         * @chainable
         */
        public removeRow(model:TSCore.App.Data.Model.ActiveModel) {

            this.collection.remove(model);

            return this;
        }

        public refresh(evt) {

            var grid = this.getGrid();

            this.rows.each(row => {
                row.remove();
            });

            this.rows = new TSCore.Data.List<Row>();

            this.models.each(model => {
                var row = new this.rowType(
                    this.columns,
                    model
                );

                this.rows.add(row);
            });

            this.prependEmptyRow();

            this.render();
            grid.events.trigger(TSGridEvents.REFRESH, {body: this});
        }

        /**
         * Renders all the rows inside this body.
         * @returns {TSGrid.Body}
         * @chainable
         */
        public render():this {

            var grid = this.getGrid();

            this.$el.empty();

            var $table = $('<table />');
            var $tbody = $('<tbody />');

            $table.append($tbody);

            this.rows.each(row => {
                $tbody.append(row.render().$el);
            });

            $table.attr('width', grid.getInnerWidth());

            this.$el.append($table);

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

            var model:TSCore.App.Data.Model.ActiveModel = this.activePosition.model;
            var column:TSGrid.Column = this.activePosition.column;

            return this.getCell(model, column);
        }

        public getCell(model:TSCore.App.Data.Model.ActiveModel, column:TSGrid.Column):TSGrid.Cell {

            var row = this.rows.whereFirst({modelId: model.getId()});
            var i = this.rows.indexOf(row);
            var j = this.columns.indexOf(column);

            return this.rows.get(i).cells.get(j);
        }

        public moveToCell(evt) {

            var model:TSCore.App.Data.Model.ActiveModel = evt.params.model;
            var row = this.rows.whereFirst({modelId: model.getId()});
            var column:TSGrid.Column = evt.params.column;
            var cell = this.getCell(model, column);

            this.activate(row, cell);
        }

        protected activate(row: TSGrid.Row, cell:TSGrid.Cell) {

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
                console.debug('enterEditMode');
                cell.enterEditMode();
            } else {
                console.debug('activate');
                cell.activate();
            }
        }

        protected changedRow(fromRow: TSGrid.Row, toRow: TSGrid.Row) {

            if (fromRow) {
                fromRow.setActive(false);
            }

            if (toRow) {
                toRow.setActive(true);
            }

            console.debug('fromRow', fromRow, 'toRow', toRow);

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

            this.events.trigger(TSGrid.BodyEvents.CHANGED_ROW, { fromRow: fromRow, toRow: toRow });
        }

        protected focusEmptyRow() {
            this.activeRow = null;
            this.activeCell = null;
            var row = this.rows.get(0);
            var cell = row.cells.get(0);
            this.activate(row, cell);
        }

        protected changedCell(fromCell: TSGrid.Cell, toCell: TSGrid.Cell) {

            console.debug('fromCell', fromCell, 'toCell', toCell);

            this.events.trigger(TSGrid.BodyEvents.CHANGED_CELL, { fromCell: fromCell, toCell: toCell });
        }

        /**
         * Move to next cell based on event
         * @param evt
         * @returns {TSGrid.Body}
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
                        if (TSGrid.callByNeed(cell.column.getEditable(), cell.column, model)) {
                            this.activate(row, cell);
                            grid.events.trigger(TSGridEvents.NEXT, {
                                row: m,
                                column: j,
                                outside: false
                            });
                        }
                    }
                    else {

                        grid.events.trigger(TSGridEvents.NEXT, {
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
                        renderable = TSGrid.callByNeed(cell.column.getRenderable(), cell.column, cell.model);
                        editable = TSGrid.callByNeed(cell.column.getEditable(), cell.column, model);

                        if (renderable && editable) {
                            this.activate(row, cell);
                            grid.events.trigger(TSGridEvents.NEXT, {
                                row: m,
                                column: n,
                                outside: false
                            });
                            break;
                        }
                    }

                    if (offset == maxOffset) {
                        grid.events.trigger(TSGridEvents.NEXT, {
                            row: ~~(offset / l),
                            column: offset - m * l,
                            outside: true
                        });
                    }
                }
            }

            return this;
        }
    }
}