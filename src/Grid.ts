import View from "./View";
import Header from "./Header";
import {Body} from "./Body";
import List from "ts-core/lib/Data/List";
import Column, {COLUMN_EVENTS} from "./Column";
import EventEmitter from "ts-core/lib/Events/EventEmitter";
import ColumnResizer, {COLUMN_RESIZER_EVENTS} from "./ColumnResizer";
import ColumnResizerGuide from "./ColumnResizerGuide";
import HeaderCell, {HEADER_CELL_EVENTS} from "./HeaderCell";
import {SortedListDirection} from "ts-core/lib/Data/SortedList";

export const GRID_EVENTS = {
    RENDERED: 'tsGrid:rendered',
    REFRESH: 'tsGrid:refresh',
    SORT: 'tsGrid:sort',
    EDIT: 'tsGrid:edit',
    EDITING: 'tsGrid:editing',
    EDITED: 'tsGrid:edited',
    ERROR: 'tsGrid:error',
    NEXT: 'tsGrid:next',
    NAVIGATE: 'tsGrid:navigate',
    CHANGED_WIDTH: 'tsGrid:changedWidth',
    CLICK: 'tsGrid:click'
};

export default class Grid extends View {

    public tagName:string = 'div';

    public className:string = 'ts-grid';

    protected _header:Header;

    protected _body:Body;

    protected _columns:List<Column>;

    protected _width:number;

    public events:EventEmitter = new EventEmitter();

    /**
     * ColumnResizer
     * @type {TSGrid.ColumnResizer}
     * @private
     */
    protected _columnResizer:ColumnResizer = new ColumnResizer;

    /**
     * ColumnResizerGuide
     * @type {TSGrid.ColumnResizerGuide}
     * @private
     */
    protected _columnResizerGuide:ColumnResizerGuide = new ColumnResizerGuide();

    /**
     * MousePageOffsetX (ColumnResizer)
     */
    public mousePageOffsetX:number;

    /**
     * MousePageOffset (ColumnResizer)
     */
    public columnResizeStartOffsetX:number;

    /**
     * LastHeaderCell (ColumnResizer)
     */
    protected _lastHeaderCell:HeaderCell;

    protected _resizeHeaderCell:HeaderCell;

    public constructor(header:Header, body:Body, columns:List<Column>) {

        super();

        this.setHeader(header);

        this.setBody(body);

        this.setColumns(columns);

        this.initialize();
    }

    public initialize() {

        super.initialize();

        $(document).on('mouseup', e => this.documentOnMouseUp(e));
        $(document).on('mouseleave', e => this.documentOnMouseLeave(e));
        $(document).on('mousemove', e => this.documentOnMouseMove(e));
    }

    protected documentOnMouseLeave(e) {

        /**
         * When mouse is released upon leaving document
         * mouse up won't be detected causing the ColumnResizer
         * to stay active. Thus we need to reset it.
         */
        this.resetColumnResizer();
    }

    /**
     * Resets the ColumnResizer
     */
    protected resetColumnResizer() {

        this._columnResizer.setActive(false);
        this._columnResizerGuide.setActive(false);
        this.createColumnResizer();
        this._resizeHeaderCell = null;
    }

    protected documentOnMouseMove(e) {

        this.mousePageOffsetX = e.pageX;

        if (this._columnResizer.getActive()) {
            this.positionColumnResizer(this.mousePageOffsetX);
        }
    }

    protected positionColumnResizer(offsetX?:number) {

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

    protected documentOnMouseUp(e) {

        if (!this._columnResizer.getActive()) {
            return;
        }

        this._columnResizer.setActive(false);
        this._columnResizerGuide.setActive(false);

        var movedX = Math.abs(this.mousePageOffsetX - this.columnResizeStartOffsetX);

        if (movedX < 5) {

            this.positionColumnResizerAtHeaderCell(this._resizeHeaderCell);
            this._resizeHeaderCell = null;
            return;
        }

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

        this._columnResizer = new ColumnResizer;
        this._columnResizerGuide = new ColumnResizerGuide;
        this._columnResizer.events.on(COLUMN_RESIZER_EVENTS.MOUSEDOWN, e => this.columnResizerOnMouseDown(e));
        this._columnResizer.events.on(COLUMN_RESIZER_EVENTS.DBLCLICK, e => this.columnResizerOnDoubleClick(e));
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

    protected columnResizerOnDoubleClick(e) {

        var column:Column = this._lastHeaderCell.column;
        var columnIndex = this._columns.indexOf(column);
        var body = this.getBody();

        var maxContentWidth = 0;
        body.rows.each(row => {

            var cell = row.cells.get(columnIndex);
            var contentWidth = cell.getContentWidth();
            maxContentWidth = contentWidth > maxContentWidth ? contentWidth : maxContentWidth;
        });

        var calculatedWidth = maxContentWidth + 14;

        var minWidth = column.getMinWidth();
        var maxWidth = column.getMaxWidth();
        var width = column.getWidth();
        var newWidth = Math.min(Math.max(calculatedWidth, minWidth), maxWidth);

        column.width(newWidth);

        this.createColumnResizer();
    }

    public sort(sortPredicate:any, sortDirection:SortedListDirection) {

        this._body.models.setSortPredicate(sortPredicate, sortDirection);
        this.afterSort(sortPredicate, sortDirection);
    }

    protected afterSort(sortPredicate:any, sortDirection:SortedListDirection) {

        if (!this._header) {
            return;
        }

        var headerRow = this._header.row;

        headerRow.cells.each(cell => {

            if (cell.column.getName() === sortPredicate) {
                cell.setSortDirection(sortDirection);
            } else {
                cell.setSortDirection(null);
            }
        });
    }

    public setHeader(header:Header):this {
        header.setGrid(this);
        this._header = header;
        return this;
    }

    public getHeader():Header {
        return this._header;
    }

    public setBody(body:Body):this {
        body.setGrid(this);
        this._body = body;
        return this;
    }

    public getBody():Body {
        return this._body;
    }

    public setColumns(columns:List<Column>):this {
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

    public getColumns():List<Column> {
        return this._columns;
    }

    public getInnerWidth():number {
        return this._width;
    }

    public getWidth() {
        // 2px; borders
        return this._width + 2;
    }

    /**
     * Renders the grid's header, then the body. Triggers a
     * `GRID_EVENTS.RENDERED` event along with a reference to the
     * grid when it has successfully been rendered.
     * @returns {TSGrid.Grid}
     */
    public render():this {

        this.$el.empty();

        if (this._header) {
            this.$el.append(this._header.render().$el);
            this.listenHeaderCells();
        }

        this.$el.append(this._body.render().$el);

        this.createColumnResizer();

        this.delegateEvents();

        this.events.trigger(GRID_EVENTS.RENDERED);

        return this;
    }

    protected listenHeaderCells() {

        var headerRow = this._header.row;

        headerRow.cells.each(cell => {
            cell.events.on(HEADER_CELL_EVENTS.CLICK, e => this.headerCellOnClick(e));
            cell.events.on(HEADER_CELL_EVENTS.MOUSEENTER, e => this.headerCellOnMouseEnter(e));
            cell.events.on(HEADER_CELL_EVENTS.MOUSELEAVE, e => this.headerCellOnMouseLeave(e));
            cell.column.events.on(COLUMN_EVENTS.CHANGED_WIDTH, e => this.columnChangedWidth(e));
        });
    }

    protected columnChangedWidth(e) {

        this.calculateWidth();
        this._header.$table.attr('width', this.getInnerWidth());
        this._body.$table.attr('width', this.getInnerWidth());
        this.events.trigger(GRID_EVENTS.CHANGED_WIDTH, {grid: this});
    }

    protected headerCellOnClick(e) {

        var headerRow = this._header.row;
        var headerCell:HeaderCell = e.params.headerCell;

        if (headerCell.column.getSortable()) {
            this.sortName(headerCell.column.getName());
        }
    }

    protected headerCellOnMouseEnter(e) {

        var headerCell:HeaderCell = e.params.headerCell;
        this._lastHeaderCell = headerCell;
        this.positionColumnResizerAtHeaderCell(headerCell);
    }

    protected headerCellOnMouseLeave(e) {

        var headerCell:HeaderCell = e.params.headerCell;
    }

    protected positionColumnResizerAtHeaderCell(headerCell:HeaderCell) {

        if (this._columnResizer.getActive() || headerCell.column.getResizable() === false) {
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

    protected sortName(name:string) {

        var sortPredicate = this._body.models.getSortPredicate();
        var sortDirection = this._body.models.getSortDirection();

        var direction = sortDirection === SortedListDirection.ASCENDING ? SortedListDirection.DESCENDING : SortedListDirection.ASCENDING;

        if (name === sortPredicate) {

            switch (sortDirection) {
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
            direction = SortedListDirection.ASCENDING;
        }

        this.sort(name, direction);
    }

    /**
     * Clean up this grid and its subviews.
     *
     * @chainable
     */
    public remove():this {
        this._header && this._header.remove.apply(this._header, arguments);
        this._body.remove.apply(this._body, arguments);
        super.remove();
        return this;
    }
}
