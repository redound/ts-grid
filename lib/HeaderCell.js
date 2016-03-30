"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var View_1 = require("./View");
var Column_1 = require("./Column");
var EventEmitter_1 = require("ts-core/lib/Events/EventEmitter");
var SortedList_1 = require("ts-core/lib/Data/SortedList");
exports.HEADER_CELL_EVENTS = {
    CLICK: 'headerCell:click',
    MOUSEENTER: 'headerCell:mouseenter',
    MOUSELEAVE: 'headerCell:mouseleave'
};
var HeaderCell = (function (_super) {
    __extends(HeaderCell, _super);
    function HeaderCell(column) {
        _super.call(this);
        this.tagName = 'th';
        this.viewEvents = {
            "mouseenter": "mouseenter",
            "mouseleave": "mouseleave",
            "click a": "click"
        };
        this.events = new EventEmitter_1.default();
        this.sortDirection = null;
        this.column = column;
        this.initialize();
    }
    HeaderCell.prototype.initialize = function () {
        var _this = this;
        _super.prototype.initialize.call(this);
        this.column.events.on(Column_1.COLUMN_EVENTS.CHANGED_WIDTH, function (e) { return _this.columnChangedWidth(e); });
    };
    HeaderCell.prototype.columnChangedWidth = function (e) {
        this.render();
    };
    HeaderCell.prototype.click = function () {
        this.events.trigger(exports.HEADER_CELL_EVENTS.CLICK, { headerCell: this });
    };
    HeaderCell.prototype.mouseenter = function () {
        this.events.trigger(exports.HEADER_CELL_EVENTS.MOUSEENTER, { headerCell: this });
    };
    HeaderCell.prototype.mouseleave = function () {
        this.events.trigger(exports.HEADER_CELL_EVENTS.MOUSELEAVE, { headerCell: this });
    };
    HeaderCell.prototype.setSortDirection = function (direction) {
        if (this.sortDirection !== direction) {
            this.sortDirection = direction;
            this.render();
        }
    };
    HeaderCell.prototype.render = function () {
        this.$el.empty();
        var $label;
        if (this.column.getDescription()) {
            this.$el.append('<div class="th-description">' + this.column.getDescription() + '</div>');
        }
        if (this.column.getSortable()) {
            $label = $('<a href="javascript:void(0)">' + this.column.getTitle() + '</a>');
        }
        else {
            $label = document.createTextNode(this.column.getTitle());
        }
        this.$el.append($label);
        this.$el.removeClass('asc');
        this.$el.removeClass('desc');
        if (this.sortDirection === SortedList_1.SortedListDirection.ASCENDING) {
            this.$el.addClass('asc');
        }
        if (this.sortDirection === SortedList_1.SortedListDirection.DESCENDING) {
            this.$el.addClass('desc');
        }
        this.$el.addClass(this.column.getClassName());
        if (this.column.getSortable()) {
            this.$el.addClass('sortable');
        }
        this.delegateEvents();
        return this;
    };
    return HeaderCell;
}(View_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HeaderCell;
