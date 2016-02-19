///<reference path="Command.ts"/>
///<reference path="CommandTypes.ts"/>

module TSGrid {

    export class Body extends TSCore.App.UI.View {

        public tagName:string = 'div';

        public className:string = 'ts-grid-body';

        /**
         * A list with Column definitions
         */
        public columns:TSCore.Data.List<Column>;

        public rowType:IRow = Row;

        public rows:TSCore.Data.List<Row>;

        public items:TSCore.Data.List<TSCore.Data.Model>;

        public _grid:Grid;

        public constructor(columns:TSCore.Data.List<Column>, items:TSCore.Data.List<TSCore.Data.Model>, rowType?:IRow) {

            super();

            this.columns = columns;

            this.items = items;

            this.rowType = rowType;

            this.initialize();
        }

        /**
         * Initializer.
         */
        public initialize() {

            super.initialize();

            this.rows = this.items.map<Row>(model => {

                return new this.rowType(
                    this.columns,
                    model
                );
            });

            this.items.events.on(TSCore.Data.List.Events.ADD, evt => this.insertRows(evt));

            this.items.events.on(TSCore.Data.List.Events.REMOVE, evt => this.removeRows(evt));
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
        }

        /**
         * Get the Body's Grid instance.
         * @returns {Grid}
         */
        public getGrid() {
            return this._grid;
        }

        /**
         * This method can be called either directly or with a certain index.
         * @param model
         * @param index
         * @param items
         */
        public insertRow(model:TSCore.Data.Model, index?:number, items?:TSCore.Data.List<TSCore.Data.Model>) {

            // insertRow() is called directly
            if (_.isUndefined(items)) {
                this.items.add(model);
                return;
            }

            var row = new this.rowType(
                this.columns,
                model
            );

            var index = items.indexOf(model);
            this.rows.insert(row, index);

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

            var operations:TSCore.Data.IListOperation[] = evt.params.operations;

            _.each(operations, operation => {
                this.insertRow(operation.item, operation.index, this.items);
            });
        }

        /**
         * This method can be called as a callback to a TSCore.Data.Collection#remove event.
         * @param evt
         */
        public removeRows(evt) {

            var operations:TSCore.Data.IListOperation[] = evt.params.operations;

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

            this.items.remove(model);

            return this;
        }

        /**
         * Renders all the rows inside this body.
         * @returns {TSGrid.Body}
         * @chainable
         */
        public render():Body {

            this.$el.empty();

            var $table = $('<table />');
            var $tbody = $('<tbody />');

            $table.append($tbody);

            this.rows.each(row => {
                $tbody.append(row.render().$el);
            });

            var tableWidth = 0;
            this.columns.each(column => {
                tableWidth += column.getWidth()
            });

            $table.attr('width', tableWidth);

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
            var command: Command = evt.params.command;
            var cell, renderable, editable, m, n;

            var i = this.items.indexOf(model);
            var j = this.columns.indexOf(column);

            if (j === -1) return this;

            var currentCell = this.rows.get(i).cells.get(j);

            if (command.navigate() || command.blurred()) {
                var l = this.columns.length;
                var maxOffset = l * this.items.length;

                if (command.blurred()) {

                    currentCell.deactivate();
                }
                else if (command.moveUp() || command.moveDown()) {
                    m = i + (command.moveUp() ? -1 : 1);

                    var e = command.getEvent();

                    if (e) {
                        e.preventDefault();
                    }

                    var row = this.rows.get(m);
                    if (row) {
                        cell = row.cells.get(j);
                        if (TSGrid.callByNeed(cell.column.getEditable(), cell.column, model)) {
                            var editMode = currentCell.editModeActive;
                            currentCell.deactivate();
                            cell.activate();
                            if (editMode) {
                                cell.enterEditMode();
                            }
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
                else if (command.moveLeft() || command.moveRight()) {

                    var e = command.getEvent();

                    if (e) {
                        e.preventDefault();
                    }

                    var right = command.moveRight();
                    for (var offset = i * l + j + (right ? 1 : -1);
                         offset >= 0 && offset < maxOffset;
                         right ? offset++ : offset--) {
                        m = ~~(offset / l);
                        n = offset - m * l;
                        cell = this.rows.get(m).cells.get(n);
                        renderable = TSGrid.callByNeed(cell.column.getRenderable(), cell.column, cell.model);
                        editable = TSGrid.callByNeed(cell.column.getEditable(), cell.column, model);

                        if (renderable && editable) {
                            var editMode = currentCell.editModeActive;
                            currentCell.deactivate();
                            cell.activate();
                            if (editMode) {
                                cell.enterEditMode();
                            }
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