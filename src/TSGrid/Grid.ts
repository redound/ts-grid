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

        /**
         * ColumnResizer
         * @type {TSGrid.ColumnResizer}
         * @private
         */
        protected _columnResizer: ColumnResizer = new ColumnResizer;

        /**
         * ColumnResizerGuide
         * @type {TSGrid.ColumnResizerGuide}
         * @private
         */
        protected _columnResizerGuide: ColumnResizerGuide = new ColumnResizerGuide;

        /**
         * MousePageOffsetX (ColumnResizer)
         */
        public mousePageOffsetX: number;

        /**
         * MousePageOffset (ColumnResizer)
         */
        public columnResizeStartOffsetX: number;

        /**
         * LastHeaderCell (ColumnResizer)
         */
        protected _lastHeaderCell: TSGrid.HeaderCell;

        protected _resizeHeaderCell: TSGrid.HeaderCell;

        public constructor(header: Header, body: Body, columns: TSCore.Data.List<Column>) {

            super();

            this.setHeader(header);

            this.setBody(body);

            this.setColumns(columns);

            this.initialize();
        }

        public initialize() {

            super.initialize();

            $(document).on('mousemove', e => this.documentOnMouseMove(e));
        }

        protected documentOnMouseMove(e) {

            this.mousePageOffsetX = e.pageX;

            if (this._columnResizer.getActive()) {
                this.positionColumnResizer(this.mousePageOffsetX);
            }
        }

        protected positionColumnResizer(offsetX?: number) {

            var bodyOuterHeight = this._body.$el.height();
            var bodyOffset = this._body.$el.offset();
            var columnResizerOffset = this._columnResizer.$el.offset();
            var columnResizerWidth = this._columnResizer.$el.width();
            var columnResizerGuideOuterWidth = this._columnResizerGuide.$el.outerWidth();
            var guideCorrection = columnResizerWidth - columnResizerGuideOuterWidth;

            this._columnResizer.$el.offset({
                top: columnResizerOffset.top,
                left: offsetX ? offsetX : columnResizerOffset.left
            });

            this._columnResizerGuide.$el.offset({
                top: bodyOffset.top,
                left: (offsetX ? offsetX : columnResizerOffset.left) + guideCorrection
            });

            this._columnResizerGuide.$el.height(bodyOuterHeight);
        }

        protected columnResizerOnMouseUp(e) {

            this._columnResizer.setActive(false);
            this._columnResizerGuide.setActive(false);
            this._columnResizer.remove();
            this.createColumnResizer();

            var headerCell = this._resizeHeaderCell;
            this._resizeHeaderCell = null;

            var minWidth = headerCell.column.getMinWidth();
            var maxWidth = headerCell.column.getMaxWidth();
            var width = headerCell.column.getWidth();
            var calculatedWidth = width + (this.mousePageOffsetX - this.columnResizeStartOffsetX);
            var newWidth = Math.min(Math.max(calculatedWidth, minWidth), maxWidth);

            if (headerCell.column.getResizable()) {
                headerCell.column.width(newWidth);
            }
        }

        protected createColumnResizer() {

            if (this._columnResizer) {
                this._columnResizer.remove();
            }

            if (this._columnResizerGuide) {
                this._columnResizerGuide.remove();
            }

            this._columnResizer = new TSGrid.ColumnResizer;
            this._columnResizerGuide = new TSGrid.ColumnResizerGuide;
            this._columnResizer.events.on(TSGrid.ColumnResizerEvents.MOUSEDOWN, e => this.columnResizerOnMouseDown(e));
            this._columnResizer.events.on(TSGrid.ColumnResizerEvents.MOUSEUP, e => this.columnResizerOnMouseUp(e));
            this.$el.append(this._columnResizer.render().$el);
            this.$el.append(this._columnResizerGuide.render().$el);
        }

        protected columnResizerOnMouseDown(e) {

            this.columnResizeStartOffsetX = this._columnResizer.$el.offset().left;
            this._columnResizer.setActive(true);
            this._columnResizerGuide.setActive(true);
            this._resizeHeaderCell = this._lastHeaderCell;
            this.positionColumnResizer();
        }

        public sort(sortPredicate: any, sortDirection: SortedListDirection) {

            this._body.models.setSortPredicate(sortPredicate, sortDirection);
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
            this._columns = columns;
            this.calculateWidth();
            return this;
        }

        public calculateWidth() {
            var width = 0;
            this._columns.each(column => {
                column.setGrid(this);
                width += column.getWidth()
            });
            this._width = width;
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

            this.createColumnResizer();

            this.delegateEvents();

            this.events.trigger(TSGridEvents.RENDERED);

            return this;
        }

        protected listenHeaderCells() {

            var headerRow = this._header.row;

            headerRow.cells.each(cell => {
                cell.events.on(HeaderCellEvents.CLICK, e => this.headerCellOnClick(e));
                cell.events.on(HeaderCellEvents.MOUSEENTER, e => this.headerCellOnMouseEnter(e));
                cell.events.on(HeaderCellEvents.MOUSELEAVE, e => this.headerCellOnMouseLeave(e));
                cell.column.events.on(TSGrid.ColumnEvents.CHANGED_WIDTH, e => this.columnChangedWidth(e));
            });
        }

        protected columnChangedWidth(e) {

            this.calculateWidth();
            this._header.$table.attr('width', this.getInnerWidth());
            this._body.$table.attr('width', this.getInnerWidth());
            this.events.trigger(TSGridEvents.CHANGED_WIDTH, { grid: this });
        }

        protected headerCellOnClick(e) {

            var headerRow = this._header.row;
            var headerCell: TSGrid.HeaderCell = e.params.headerCell;

            if (headerCell.column.getSortable()) {
                this.sortName(headerCell.column.getName());
            }
        }

        protected headerCellOnMouseEnter(e) {

            var headerCell: TSGrid.HeaderCell = e.params.headerCell;
            this._lastHeaderCell = headerCell;
            this.positionColumnResizerAtHeaderCell(headerCell);
        }

        protected headerCellOnMouseLeave(e) {

            var headerCell: TSGrid.HeaderCell = e.params.headerCell;
        }

        protected positionColumnResizerAtHeaderCell(headerCell: TSGrid.HeaderCell) {

            if (this._columnResizer.getActive()) {
                return;
            }

            var headerCellOuterHeight = headerCell.$el.outerHeight();
            var headerCellOffset = headerCell.$el.offset();
            var columnResizerWidth = this._columnResizer.$el.width();

            // Position
            this._columnResizer.$el.offset({
                top: headerCellOffset.top,
                left: headerCellOffset.left + headerCell.column.getWidth() - columnResizerWidth + 1
            });

            // Correct height
            this._columnResizer.$el.height(headerCellOuterHeight);
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
                        name = this._body.getDelegate().bodyDefaultSortPredicateForModels(this._body);
                        direction = this._body.getDelegate().bodyDefaultSortDirectionForModels(this._body);
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
        public remove(): this {
            this._header && this._header.remove.apply(this._header, arguments);
            this._body.remove.apply(this._body, arguments);
            super.remove();
            return this;
        }
    }
}