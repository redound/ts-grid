///<reference path="Row.ts"/>

module TSGrid {

    export class HeaderRow extends TSCore.App.UI.View {

        public tagName: string = 'tr';

        public columns: TSCore.Data.List<Column>;

        public cells: TSCore.Data.List<TSGrid.HeaderCell>;

        public constructor(columns: TSCore.Data.List<Column>) {

            super();

            this.columns = columns;

            this.cells = new TSCore.Data.List<HeaderCell>();

            this.initialize();
        }

        public initialize() {

            super.initialize();

            this.columns.each(column => {
                this.cells.add(this.makeCell(column));
            });
        }

        public makeCell(column: Column) {

            var headerCell = column.getHeaderType();

            return new headerCell(
                column
            );
        }

        /**
         * Renders a row of cells for this row's model
         */
        public render(): this {

            this.$el.empty();

            var fragment = document.createDocumentFragment();
            this.cells.each(cell => {
                fragment.appendChild(cell.render().el);
            });

            this.el.appendChild(fragment);

            this.delegateEvents();

            return this;
        }
    }
}