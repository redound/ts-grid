///<reference path="View.ts"/>
///<reference path="Command.ts"/>
///<reference path="CommandTypes.ts"/>
///<reference path="GridPosition.ts"/>

module TSGrid {

    export class Body extends View {

        public tagName:string = 'div';

        public className:string = 'ts-grid-body';

        public columns:TSCore.Data.List<Column>;

        public row:IRow = Row;

        public rows:TSCore.Data.List<Row>;

        public items:TSCore.Data.List<TSCore.Data.Model>;

        public _grid:Grid;

        public constructor(columns:TSCore.Data.List<Column>, items:TSCore.Data.List<TSCore.Data.Model>, rowClass?:IRow) {

            super();

            this.columns = columns;

            this.items = items;

            this.row = rowClass;

            this.initialize();
        }

        public initialize() {

            super.initialize();

            var grid = this.getGrid();

            this.rows = this.items.map<Row>(model => {

                return new this.row(
                    this.columns,
                    model
                );
            });

            this.items.events.on(TSCore.Data.List.Events.ADD, evt => this.insertRows(evt));

            this.items.events.on(TSCore.Data.List.Events.REMOVE, evt => this.removeRows(evt));
        }

        public setGrid(grid:Grid) {
            this._grid = grid;
            grid.events.on(TSGrid.TSGridEvents.EDITED, this.moveToNextCell, this);
            grid.events.on(TSGrid.TSGridEvents.NAVIGATE, this.moveToNextCell, this);
        }

        public getGrid() {
            return this._grid;
        }

        public insertRow(model:TSCore.Data.Model, index?:number, items?:TSCore.Data.List<TSCore.Data.Model>) {

            // insertRow() is called directly
            if (_.isUndefined(items)) {
                this.items.add(model);
                return;
            }

            var row = new this.row(
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

        public insertRows(evt) {

            var operations:TSCore.Data.IListOperation[] = evt.params.operations;

            _.each(operations, operation => {
                this.insertRow(operation.item, operation.index, this.items);
            });
        }

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

        public removeRow(model:TSCore.Data.Model) {

            this.items.remove(model);

            return this;
        }

        public refresh() {

        }

        /**
         * Renders all the rows inside this body.
         * @returns {TSGrid.Body}
         */
        public render():Body {

            this.$el.empty();

            var table = document.createElement('table');
            var tbody = document.createElement('tbody');
            table.appendChild(tbody);

            this.rows.each(row => {
                tbody.appendChild(row.render().el);
            });

            this.el.appendChild(table);

            this.delegateEvents();

            return this;
        }

        public remove() {
            this.rows.each(function (row) {
                row.remove.apply(row, arguments);
            });
            return super.remove();
        }

        public moveToNextCell(evt) {

            console.log('moveToNextCell', evt);

            var grid = this.getGrid();

            var model = evt.params.model;
            var column = evt.params.column;
            var command: Command = evt.params.command;
            var cell, renderable, editable, m, n;

            var i = this.items.indexOf(model);
            var j = this.columns.indexOf(column);

            if (j === -1) return this;

            var currentCell = this.rows.get(i).cells.get(j);

            //var currentRow = this.rows.get(i);
            //currentRow.render();

            if (command.navigate() || command.blurred()) {
                var l = this.columns.length;
                var maxOffset = l * this.items.length;

                if (command.blurred()) {

                    console.debug('BLURRED');

                    currentCell.blur();
                }
                else if (command.moveUp() || command.moveDown()) {
                    m = i + (command.moveUp() ? -1 : 1);

                    console.debug('MOVEUP MOVEDOWN');

                    var row = this.rows.get(m);
                    if (row) {
                        cell = row.cells.get(j);
                        if (TSGrid.callByNeed(cell.column.getEditable(), cell.column, model)) {
                            var editMode = currentCell.editModeActive;
                            currentCell.blur();
                            cell.focus();
                            if (editMode) {
                                cell.enterEditMode();
                            }
                            model.events.trigger(TSGridEvents.NEXT, {
                                m: m,
                                j: j,
                                b: false
                            });
                        }
                    }
                    else {
                        model.events.trigger(TSGridEvents.NEXT, {
                            m: m,
                            j: j,
                            b: true
                        });
                    }
                }
                else if (command.moveLeft() || command.moveRight()) {

                    console.debug('MOVELEFT MOVERIGHT');

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
                            currentCell.blur();
                            cell.focus();
                            if (editMode) {
                                cell.enterEditMode();
                            }
                            model.events.trigger(TSGridEvents.NEXT, {
                                m: m,
                                j: n,
                                b: false
                            });
                            break;
                        }
                    }

                    if (offset == maxOffset) {
                        model.events.trigger(TSGridEvents.NEXT, {
                            m: ~~(offset / l),
                            j: offset - m * l,
                            b: true
                        });
                    }
                }
            }

            return this;
        }

        public reset() {

        }
    }
}