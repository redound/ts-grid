"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var View_1 = require("./View");
var List_1 = require("ts-core/lib/Data/List");
var HeaderRow = (function (_super) {
    __extends(HeaderRow, _super);
    function HeaderRow(columns) {
        _super.call(this);
        this.tagName = 'tr';
        this.columns = columns;
        this.cells = new List_1.default();
        this.initialize();
    }
    HeaderRow.prototype.initialize = function () {
        var _this = this;
        _super.prototype.initialize.call(this);
        this.columns.each(function (column) {
            _this.cells.add(_this.makeCell(column));
        });
    };
    HeaderRow.prototype.makeCell = function (column) {
        var headerCell = column.getHeaderType();
        return new headerCell(column);
    };
    HeaderRow.prototype.render = function () {
        this.$el.empty();
        var fragment = document.createDocumentFragment();
        this.cells.each(function (cell) {
            fragment.appendChild(cell.render().el);
        });
        this.el.appendChild(fragment);
        this.delegateEvents();
        return this;
    };
    return HeaderRow;
}(View_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HeaderRow;
