"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var View_1 = require("./View");
var Column_1 = require("./Column");
var EventEmitter_1 = require("ts-core/lib/Events/EventEmitter");
var ColumnResizer_1 = require("./ColumnResizer");
var ColumnResizerGuide_1 = require("./ColumnResizerGuide");
var HeaderCell_1 = require("./HeaderCell");
var SortedList_1 = require("ts-core/lib/Data/SortedList");
exports.GRID_EVENTS = {
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
var Grid = (function (_super) {
    __extends(Grid, _super);
    function Grid(header, body, columns) {
        _super.call(this);
        this.tagName = 'div';
        this.className = 'ts-grid';
        this.events = new EventEmitter_1.default();
        this._columnResizer = new ColumnResizer_1.default;
        this._columnResizerGuide = new ColumnResizerGuide_1.default();
        this.setHeader(header);
        this.setBody(body);
        this.setColumns(columns);
        this.initialize();
    }
    Grid.prototype.initialize = function () {
        var _this = this;
        _super.prototype.initialize.call(this);
        $(document).on('mouseup', function (e) { return _this.documentOnMouseUp(e); });
        $(document).on('mouseleave', function (e) { return _this.documentOnMouseLeave(e); });
        $(document).on('mousemove', function (e) { return _this.documentOnMouseMove(e); });
    };
    Grid.prototype.documentOnMouseLeave = function (e) {
        this.resetColumnResizer();
    };
    Grid.prototype.resetColumnResizer = function () {
        this._columnResizer.setActive(false);
        this._columnResizerGuide.setActive(false);
        this.createColumnResizer();
        this._resizeHeaderCell = null;
    };
    Grid.prototype.documentOnMouseMove = function (e) {
        this.mousePageOffsetX = e.pageX;
        if (this._columnResizer.getActive()) {
            this.positionColumnResizer(this.mousePageOffsetX);
        }
    };
    Grid.prototype.positionColumnResizer = function (offsetX) {
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
    };
    Grid.prototype.documentOnMouseUp = function (e) {
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
    };
    Grid.prototype.createColumnResizer = function () {
        var _this = this;
        if (this._columnResizer) {
            this._columnResizer.remove();
        }
        if (this._columnResizerGuide) {
            this._columnResizerGuide.remove();
        }
        this._columnResizer = new ColumnResizer_1.default;
        this._columnResizerGuide = new ColumnResizerGuide_1.default;
        this._columnResizer.events.on(ColumnResizer_1.COLUMN_RESIZER_EVENTS.MOUSEDOWN, function (e) { return _this.columnResizerOnMouseDown(e); });
        this._columnResizer.events.on(ColumnResizer_1.COLUMN_RESIZER_EVENTS.DBLCLICK, function (e) { return _this.columnResizerOnDoubleClick(e); });
        this.$el.append(this._columnResizer.render().$el);
        this.$el.append(this._columnResizerGuide.render().$el);
    };
    Grid.prototype.columnResizerOnMouseDown = function (e) {
        this.columnResizeStartOffsetX = this._columnResizer.$el.offset().left;
        this._columnResizer.setActive(true);
        this._columnResizerGuide.setActive(true);
        this._resizeHeaderCell = this._lastHeaderCell;
        this.positionColumnResizer();
    };
    Grid.prototype.columnResizerOnDoubleClick = function (e) {
        var column = this._lastHeaderCell.column;
        var columnIndex = this._columns.indexOf(column);
        var body = this.getBody();
        var maxContentWidth = 0;
        body.rows.each(function (row) {
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
    };
    Grid.prototype.sort = function (sortPredicate, sortDirection) {
        this._body.models.setSortPredicate(sortPredicate, sortDirection);
        this.afterSort(sortPredicate, sortDirection);
    };
    Grid.prototype.afterSort = function (sortPredicate, sortDirection) {
        if (!this._header) {
            return;
        }
        var headerRow = this._header.row;
        headerRow.cells.each(function (cell) {
            if (cell.column.getName() === sortPredicate) {
                cell.setSortDirection(sortDirection);
            }
            else {
                cell.setSortDirection(null);
            }
        });
    };
    Grid.prototype.setHeader = function (header) {
        header.setGrid(this);
        this._header = header;
        return this;
    };
    Grid.prototype.getHeader = function () {
        return this._header;
    };
    Grid.prototype.setBody = function (body) {
        body.setGrid(this);
        this._body = body;
        return this;
    };
    Grid.prototype.getBody = function () {
        return this._body;
    };
    Grid.prototype.setColumns = function (columns) {
        this._columns = columns;
        this.calculateWidth();
        return this;
    };
    Grid.prototype.calculateWidth = function () {
        var _this = this;
        var width = 0;
        this._columns.each(function (column) {
            column.setGrid(_this);
            width += column.getWidth();
        });
        this._width = width;
    };
    Grid.prototype.getColumns = function () {
        return this._columns;
    };
    Grid.prototype.getInnerWidth = function () {
        return this._width;
    };
    Grid.prototype.getWidth = function () {
        return this._width + 2;
    };
    Grid.prototype.render = function () {
        this.$el.empty();
        if (this._header) {
            this.$el.append(this._header.render().$el);
            this.listenHeaderCells();
        }
        this.$el.append(this._body.render().$el);
        this.createColumnResizer();
        this.delegateEvents();
        this.events.trigger(exports.GRID_EVENTS.RENDERED);
        return this;
    };
    Grid.prototype.listenHeaderCells = function () {
        var _this = this;
        var headerRow = this._header.row;
        headerRow.cells.each(function (cell) {
            cell.events.on(HeaderCell_1.HEADER_CELL_EVENTS.CLICK, function (e) { return _this.headerCellOnClick(e); });
            cell.events.on(HeaderCell_1.HEADER_CELL_EVENTS.MOUSEENTER, function (e) { return _this.headerCellOnMouseEnter(e); });
            cell.events.on(HeaderCell_1.HEADER_CELL_EVENTS.MOUSELEAVE, function (e) { return _this.headerCellOnMouseLeave(e); });
            cell.column.events.on(Column_1.COLUMN_EVENTS.CHANGED_WIDTH, function (e) { return _this.columnChangedWidth(e); });
        });
    };
    Grid.prototype.columnChangedWidth = function (e) {
        this.calculateWidth();
        this._header.$table.attr('width', this.getInnerWidth());
        this._body.$table.attr('width', this.getInnerWidth());
        this.events.trigger(exports.GRID_EVENTS.CHANGED_WIDTH, { grid: this });
    };
    Grid.prototype.headerCellOnClick = function (e) {
        var headerRow = this._header.row;
        var headerCell = e.params.headerCell;
        if (headerCell.column.getSortable()) {
            this.sortName(headerCell.column.getName());
        }
    };
    Grid.prototype.headerCellOnMouseEnter = function (e) {
        var headerCell = e.params.headerCell;
        this._lastHeaderCell = headerCell;
        this.positionColumnResizerAtHeaderCell(headerCell);
    };
    Grid.prototype.headerCellOnMouseLeave = function (e) {
        var headerCell = e.params.headerCell;
    };
    Grid.prototype.positionColumnResizerAtHeaderCell = function (headerCell) {
        if (this._columnResizer.getActive() || headerCell.column.getResizable() === false) {
            return;
        }
        var headerCellOuterHeight = headerCell.$el.outerHeight();
        var headerCellOffset = headerCell.$el.offset();
        var columnResizerWidth = this._columnResizer.$el.width();
        this._columnResizer.$el.offset({
            top: headerCellOffset.top,
            left: headerCellOffset.left + headerCell.column.getWidth() - columnResizerWidth + 1
        });
        this._columnResizer.$el.height(headerCellOuterHeight);
    };
    Grid.prototype.sortName = function (name) {
        var sortPredicate = this._body.models.getSortPredicate();
        var sortDirection = this._body.models.getSortDirection();
        var direction = sortDirection === SortedList_1.SortedListDirection.ASCENDING ? SortedList_1.SortedListDirection.DESCENDING : SortedList_1.SortedListDirection.ASCENDING;
        if (name === sortPredicate) {
            switch (sortDirection) {
                case SortedList_1.SortedListDirection.ASCENDING:
                    direction = SortedList_1.SortedListDirection.DESCENDING;
                    break;
                case SortedList_1.SortedListDirection.DESCENDING:
                    name = this._body.getDelegate().bodyDefaultSortPredicateForModels(this._body);
                    direction = this._body.getDelegate().bodyDefaultSortDirectionForModels(this._body);
                    break;
                default:
                    direction = SortedList_1.SortedListDirection.ASCENDING;
                    break;
            }
        }
        else {
            direction = SortedList_1.SortedListDirection.ASCENDING;
        }
        this.sort(name, direction);
    };
    Grid.prototype.remove = function () {
        this._header && this._header.remove.apply(this._header, arguments);
        this._body.remove.apply(this._body, arguments);
        _super.prototype.remove.call(this);
        return this;
    };
    return Grid;
}(View_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Grid;
