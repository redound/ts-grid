module TSGrid {

    export class Grid extends TSCore.App.UI.View {

        public tagName: string = 'div';

        public className: string = 'ts-grid';

        protected _header: Header;

        protected _body: Body;

        protected _columns: TSCore.Data.List<Column>;

        public events: TSCore.Events.EventEmitter = new TSCore.Events.EventEmitter();

        public constructor(header: Header, body: Body, columns: TSCore.Data.List<Column>) {

            super();

            this.setHeader(header);
            this.setBody(body);
            this.setColumns(columns);

            this.initialize();
        }

        public initialize() {

            super.initialize();
        }

        public setHeader(header: Header) {
            header.setGrid(this);
            this._header = header;
        }

        public getHeader(): Header {
            return this._header;
        }

        public setBody(body: Body) {
            body.setGrid(this);
            this._body = body;
        }

        public getBody(): Body {
            return this._body;
        }

        public setColumns(columns: TSCore.Data.List<Column>) {
            columns.each(column => {
                column.setGrid(this);
            });
            this._columns = columns;
        }

        public getColumns(): TSCore.Data.List<Column> {
            return this._columns;
        }

        /**
         * Delegates to TSGrid.Body#insertRow
         * @returns {TSGrid.Grid}
         */
        public insertRow(): Grid {
            this._body.insertRow.apply(this._body, arguments);
            return this;
        }

        /**
         * Delegate to TSGrid.Body#removeRow
         * @returns {TSGrid.Grid}
         */
        public removeRow(): Grid {
            this._body.removeRow.apply(this._body, arguments);
            return this;
        }

        /**
         * Renders the grid's header, then the body. Triggers a
         * `TSGridEvents.RENDERED` event along with a reference to the
         * grid when it has successfully been rendered.
         * @returns {TSGrid.Grid}
         */
        public render() {

            this.$el.empty();

            if (this._header) {
                this.$el.append(this._header.render().$el);
            }

            this.$el.append(this._body.render().$el);

            this.delegateEvents();

            this.events.trigger(TSGridEvents.RENDERED);

            return this;
        }

        /**
         * Clean up this grid and its subviews.
         *
         * @chainable
         */
        public remove() {
            this._header && this._header.remove.apply(this._header, arguments);
            this._body.remove.apply(this._body, arguments);
            return super.remove();
        }
    }
}