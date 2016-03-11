module TSGrid {

    import SortedListDirection = TSCore.Data.SortedListDirection;
    export class Grid extends TSCore.App.UI.View {

        public tagName: string = 'div';

        public className: string = 'ts-grid';

        protected _header: Header;

        protected _body: Body;

        protected _columns: TSCore.Data.List<Column>;

        protected _width: number;

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

            console.log('Initialize grid');
        }

        public sort(sortPredicate: any, sortDirection: SortedListDirection) {

            this._body.models.sort(sortPredicate, sortDirection);
            this.afterSort(sortPredicate, sortDirection);
        }

        protected afterSort(sortPredicate: any, sortDirection: SortedListDirection) {

            if (!this._header) {
                return;
            }

            var headerRow = this._header.row;

            headerRow.cells.each(cell => {

                if (cell.column.getName() === sortPredicate) {
                    console.log(cell.column.getName() + ' was clicked');
                    cell.setSortDirection(sortDirection);
                } else {
                    cell.setSortDirection(null);
                }
            });
        }

        public setHeader(header: Header): this {
            header.setGrid(this);
            this._header = header;
            return this;
        }

        public getHeader(): Header {
            return this._header;
        }

        public setBody(body: Body): this {
            body.setGrid(this);
            this._body = body;
            return this;
        }

        public getBody(): Body {
            return this._body;
        }

        public setColumns(columns: TSCore.Data.List<Column>): this {
            var width = 0;
            columns.each(column => {
                column.setGrid(this);
                width += column.getWidth()
            });
            this._width = width;
            this._columns = columns;
            return this;
        }

        public getColumns(): TSCore.Data.List<Column> {
            return this._columns;
        }

        public getInnerWidth(): number {
            return this._width;
        }

        public getWidth() {
            // 2px; borders
            return this._width + 2;
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
        public render(): this {

            this.$el.empty();

            if (this._header) {
                this.$el.append(this._header.render().$el);
                this.listenHeaderCells();
            }

            this.$el.append(this._body.render().$el);

            this.delegateEvents();

            this.events.trigger(TSGridEvents.RENDERED);

            return this;
        }

        protected listenHeaderCells() {

            var headerRow = this._header.row;

            headerRow.cells.each(cell => {
                cell.events.on(HeaderCellEvents.CLICK, e => this.headerCellOnClick(e));
            });
        }

        protected headerCellOnClick(e) {

            var headerRow = this._header.row;
            var headerCell: TSGrid.HeaderCell = e.params.headerCell;

            if (headerCell.column.getSortable()) {
                this.sortName(headerCell.column.getName());
            }
        }

        protected sortName(name: string) {

            var sortPredicate = this._body.models.getSortPredicate();
            var sortDirection = this._body.models.getSortDirection();

            var direction = sortDirection === TSCore.Data.SortedListDirection.ASCENDING ? TSCore.Data.SortedListDirection.DESCENDING : TSCore.Data.SortedListDirection.ASCENDING;

            if (name === sortPredicate) {

                switch(sortDirection) {
                    case SortedListDirection.ASCENDING:
                        direction = SortedListDirection.DESCENDING;
                        break;
                    case SortedListDirection.DESCENDING:
                        direction = null;
                        break;
                    default:
                        direction = SortedListDirection.ASCENDING;
                        break;
                }

            } else {
                direction = TSCore.Data.SortedListDirection.ASCENDING;
            }

            this.sort(name, direction);
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