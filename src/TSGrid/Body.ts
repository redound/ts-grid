///<reference path="Command.ts"/>
///<reference path="CommandTypes.ts"/>

module TSGrid {

    export interface GridPosition {
        model: TSCore.Data.Model,
        column: TSGrid.Column
    }

    export class Body extends TSCore.App.UI.View {

        public tagName:string = 'div';

        public className:string = 'ts-grid-body';

        public activePosition:GridPosition;

        public activeCell:Cell;

        /**
         * A list with Column definitions
         */
        public columns:TSCore.Data.List<Column>;

        public rowType:IRow = Row;

        public rows:TSCore.Data.List<Row>;

        public models:TSCore.Data.SortedList<TSCore.Data.Model>;

        public collection:TSCore.Data.ModelCollection<TSCore.Data.Model>;

        public _grid:Grid;

        public constructor(columns:TSCore.Data.List<Column>, collection:TSCore.Data.ModelCollection<TSCore.Data.Model>, rowType?:IRow) {

            super();

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
            this.models = new TSCore.Data.SortedList<TSCore.Data.Model>(models, 'title');

            this.models.resort();
            this.models.each(model => {

                this.rows.add(new this.rowType(
                    this.columns,
                    model
                ));
            });

            this.collection.events.on(TSCore.Data.CollectionEvents.ADD, evt => this.addModels(evt));
            this.collection.events.on(TSCore.Data.CollectionEvents.REMOVE, evt => this.removeModels(evt));
            this.models.events.on(TSCore.Data.SortedListEvents.ADD, evt => this.insertRows(evt));
            this.models.events.on(TSCore.Data.SortedListEvents.REMOVE, evt => this.removeRows(evt));
            this.models.events.on(TSCore.Data.SortedListEvents.SORT, evt => this.refresh(evt));
        }

        protected addModels(evt) {

            var operations:TSCore.Data.ICollectionOperation<TSCore.Data.Model>[] = evt.params.operations;


            _.each(operations, operation => {

                console.log(`add item '${operation.item.get('title')}' from models, collectionIndex: '${operation.index}', modelsIndex: '${this.models.indexOf(operation.item)}'`);

                this.models.add(operation.item);
            });
        }

        protected removeModels(evt) {

            var operations:TSCore.Data.ICollectionOperation<TSCore.Data.Model>[] = evt.params.operations;

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

        /**
         * This method can be called either directly or with a certain index.
         * @param model
         * @param index
         * @param items
         */
        public insertRow(model:TSCore.Data.Model, index?:number, items?:TSCore.Data.ModelCollection<TSCore.Data.Model>) {

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

            var operations:TSCore.Data.ICollectionOperation<TSCore.Data.Model>[] = evt.params.operations;

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

            var operations:TSCore.Data.ICollectionOperation<TSCore.Data.Model>[] = evt.params.operations;

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
        public removeRow(model:TSCore.Data.Model) {

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

        public remove() {
            this.rows.each(function (row) {
                row.remove.apply(row, arguments);
            });
            return super.remove();
        }

        public getActiveCell() {

            var model:TSCore.Data.Model = this.activePosition.model;
            var column:TSGrid.Column = this.activePosition.column;

            return this.getCell(model, column);
        }

        public getCell(model:TSCore.Data.Model, column:TSGrid.Column):TSGrid.Cell {

            var row = this.rows.whereFirst({modelId: model.getId()});
            var i = this.rows.indexOf(row);
            var j = this.columns.indexOf(column);

            return this.rows.get(i).cells.get(j);
        }

        public moveToCell(evt) {

            var model:TSCore.Data.Model = evt.params.model;
            var column:TSGrid.Column = evt.params.column;
            var cell = this.getCell(model, column);

            this.activateCell(cell);
        }

        protected activateCell(cell:TSGrid.Cell) {

            if (this.activeCell !== cell) {
                if (this.activeCell) {
                    this.activeCell.deactivate();
                }
                this.activeCell = cell;
            }

            if (cell.isActivated()) {
                cell.enterEditMode();
            } else {
                cell.activate();
            }
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
                var maxOffset = l * this.collection.length;

                if (cmd.up() || cmd.down() || cmd.enter()) {
                    m = i + (cmd.up() ? -1 : 1);

                    var row = this.rows.get(m);
                    if (row) {
                        cell = row.cells.get(j);
                        if (TSGrid.callByNeed(cell.column.getEditable(), cell.column, model)) {
                            this.activateCell(cell);
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
                            this.activateCell(cell);
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