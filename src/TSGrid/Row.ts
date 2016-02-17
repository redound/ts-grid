///<reference path="View.ts"/>

module TSGrid {

    export interface IRow {
        new (columns: TSCore.Data.List<Column>, model: TSCore.Data.Model): Row;
    }

    export class Row extends View {

        public tagName: string = 'tr';

        public columns: TSCore.Data.List<Column>;

        public model: TSCore.Data.Model;

        public cells: TSCore.Data.List<Cell>;

        public constructor(columns: TSCore.Data.List<Column>, model: TSCore.Data.Model) {

            super();

            this.columns = columns;
            this.model = model;
            this.cells = new TSCore.Data.List<Cell>();

            this.initialize();
        }

        public initialize() {

            super.initialize();

            this.columns.each(column => {
                this.cells.add(this.makeCell(column));
            });
        }

        public makeCell(column: Column) {

            return new Cell(
                column,
                this.model
            );
        }

        /**
         * Renders a row of cells for this row's model
         */
        public render(): Row {

            this.$el.empty();

            var fragment = document.createDocumentFragment();
            this.cells.each(cell => {
                fragment.appendChild(cell.render().el);
            });

            this.el.appendChild(fragment);

            this.delegateEvents();

            return this;
        }

        public reset() {

        }
    }
}