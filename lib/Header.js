"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var List_1 = require("ts-core/lib/Data/List");
var View_1 = require("./View");
var Column_1 = require("./Column");
var HeaderRow_1 = require("./HeaderRow");
var $ = require("jquery");
var Header = (function (_super) {
    __extends(Header, _super);
    function Header(columns) {
        _super.call(this);
        this.tagName = 'div';
        this.className = 'ts-grid-header';
        this.viewEvents = {
            "dragstart": "dragstart"
        };
        this.cols = new List_1.default();
        this.columns = columns;
        this.initialize();
    }
    Header.prototype.initialize = function () {
        var _this = this;
        _super.prototype.initialize.call(this);
        this.row = new HeaderRow_1.default(this.columns);
        this.columns.each(function (column) {
            column.events.on(Column_1.COLUMN_EVENTS.CHANGED_WIDTH, function (e) { return _this.columnChangedWidth(e); });
        });
    };
    Header.prototype.columnChangedWidth = function (e) {
        var column = e.params.column;
        var columnIndex = this.columns.indexOf(column);
        var col = this.cols.get(columnIndex);
        if (col) {
            col.width(column.getWidth());
        }
    };
    Header.prototype.dragstart = function (e) {
        e.preventDefault();
        e.stopPropagation();
    };
    Header.prototype.setGrid = function (grid) {
        this._grid = grid;
        return this;
    };
    Header.prototype.getGrid = function () {
        return this._grid;
    };
    Header.prototype.render = function () {
        var _this = this;
        var grid = this.getGrid();
        this.$table = $('<table />');
        this.$colgroup = $('<colgroup />');
        this.cols.clear();
        this.columns.each(function (column) {
            var $col = $('<col />');
            $col.css('width', column.getWidth());
            _this.$colgroup.append($col);
            _this.cols.add($col);
        });
        var $thead = $('<thead />');
        this.$table.append(this.$colgroup);
        this.$table.append($thead);
        $thead.append(this.row.render().$el);
        this.$table.attr('width', grid.getInnerWidth());
        this.$el.append(this.$table);
        this.delegateEvents();
        return this;
    };
    return Header;
}(View_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Header;
