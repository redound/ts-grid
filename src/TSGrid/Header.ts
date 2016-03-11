module TSGrid {

    export class Header extends TSCore.App.UI.View {

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

            this.row = new HeaderRow(this.columns);
        }

        public setGrid(grid: Grid): this {
            this._grid = grid;
            return this;
        }

        public getGrid(): Grid {
            return this._grid;
        }

        public render(): this {

            var grid = this.getGrid();

            var $table = $('<table />');
            var $thead = $('<thead />');
            $table.append($thead);
            $thead.append(this.row.render().$el);

            $table.attr('width', grid.getInnerWidth());

            this.$el.append($table);

            this.delegateEvents();
            return this;
        }
    }
}