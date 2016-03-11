module TSGrid {

    export interface IRow {
        new (columns: TSCore.Data.List<Column>, model: TSCore.App.Data.Model.ActiveModel): Row;
    }

    export class Row extends TSCore.App.UI.View {

        public tagName: string = 'tr';

        public columns: TSCore.Data.List<Column>;

        public modelId: any;

        public model: TSCore.App.Data.Model.ActiveModel;

        public cells: TSCore.Data.List<Cell>;

        public constructor(columns: TSCore.Data.List<Column>, model: TSCore.App.Data.Model.ActiveModel) {

            super();

            this.columns = columns;

            this.setModel(model);

            this.cells = new TSCore.Data.List<Cell>();

            this.initialize();
        }

        public initialize() {

            super.initialize();

            this.columns.each(column => {
                this.cells.add(this.makeCell(column));
            });
        }

        public setModel(model: TSCore.App.Data.Model.ActiveModel): this {

            if (!model) return;
            this.model = model;
            this.modelId = model.getId();
            return this;
        }

        public makeCell(column: Column) {

            var cellType = column.getCellType();

            return new cellType(
                column,
                this.model
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

        public reset() {

        }
    }
}