///<reference path="View.ts"/>


module TSGrid {

    export class Header extends View {

        public tagName: string = 'div';

        public className: string = 'ts-grid-header';

        public columns: TSCore.Data.List<Column>;

        public row: HeaderRow;

        public _grid: Grid;

        public constructor(columns: TSCore.Data.List<Column>) {

            super();

            this.columns = columns;

            this.initialize();
        }

        public initialize() {

            super.initialize();

            this.row = new HeaderRow(
                this.columns,
                null
            );

        }

        public setGrid(grid: Grid) {
            this._grid = grid;
        }

        public getGrid(): Grid {
            return this._grid;
        }

        public render() {

            var $table = $('<table />');
            $table.append(this.row.render().$el);

            var tableWidth = 0;
            this.columns.each(column => {
                tableWidth += column.getWidth();
            });

            $table.attr('width', tableWidth);

            this.$el.append($table);

            this.delegateEvents();
            return this;
        }

        public reset() {

        }
    }
}