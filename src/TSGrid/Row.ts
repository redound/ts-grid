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

        public events: TSCore.Events.EventEmitter = new TSCore.Events.EventEmitter();

        protected _active;

        protected _loading;

        public valid: boolean = false;

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

        public setLoading(loading: boolean) {
            this._loading = loading;

            if (this._loading) {
                this.$el.addClass('loading');
            } else {
                this.$el.removeClass('loading');
            }
        }

        public setActive(active: boolean) {
            this._active = active;

            if (this._active) {
                this.$el.addClass('active');
            } else {
                this.$el.removeClass('active');
            }
        }

        public setModel(model: TSCore.App.Data.Model.ActiveModel): this {

            if (!model) return;
            this.model = model;
            this.modelId = model.getId();
            return this;
        }

        public makeCell(column: Column) {

            var cellType = column.getCellType();

            var cell = new cellType(
                column,
                this.model
            );

            cell.events.on(TSGrid.CellEvents.CHANGED, e => this.cellDidChange(e));
            cell.events.on(TSGrid.CellEvents.CLEARED, e => this.cellDidClear(e));

            return cell;
        }

        protected cellDidChange(e) {

            this.events.trigger(TSGrid.RowEvents.CHANGED, { row: this });
            this.render();
        }

        protected cellDidClear(e) {
            this.render();
        }

        /**
         * Renders a row of cells for this row's model
         */
        public render(): this {

            this.$el.empty();

            var fragment = document.createDocumentFragment();
            this.cells.each(cell => {
                cell.validationEnabled(true);
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