"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var List_1 = require("ts-core/lib/Data/List");
var View_1 = require("./View");
var EventEmitter_1 = require("ts-core/lib/Events/EventEmitter");
var Cell_1 = require("./Cell");
exports.ROW_EVENTS = {
    CHANGED: 'row:changed'
};
var Row = (function (_super) {
    __extends(Row, _super);
    function Row(columns, model) {
        _super.call(this);
        this.tagName = 'tr';
        this.events = new EventEmitter_1.default();
        this.valid = false;
        this.columns = columns;
        this.setModel(model);
        this.cells = new List_1.default();
        this.initialize();
    }
    Row.prototype.initialize = function () {
        var _this = this;
        _super.prototype.initialize.call(this);
        this.columns.each(function (column) {
            _this.cells.add(_this.makeCell(column));
        });
    };
    Row.prototype.setLoading = function (loading) {
        this._loading = loading;
        if (this._loading) {
            this.$el.addClass('loading');
        }
        else {
            this.$el.removeClass('loading');
        }
    };
    Row.prototype.setActive = function (active) {
        this._active = active;
        if (this._active) {
            this.$el.addClass('active');
        }
        else {
            this.$el.removeClass('active');
        }
    };
    Row.prototype.setModel = function (model) {
        if (!model)
            return;
        this.model = model;
        this.modelId = model.getId();
        return this;
    };
    Row.prototype.makeCell = function (column) {
        var _this = this;
        var cellType = column.getCellType();
        var cell = new cellType(column, this.model);
        cell.events.on(Cell_1.CELL_EVENTS.CHANGED, function (e) { return _this.cellDidChange(e); });
        cell.events.on(Cell_1.CELL_EVENTS.CLEARED, function (e) { return _this.cellDidClear(e); });
        return cell;
    };
    Row.prototype.cellDidChange = function (e) {
        this.events.trigger(exports.ROW_EVENTS.CHANGED, { row: this });
        this.render();
    };
    Row.prototype.cellDidClear = function (e) {
        this.render();
    };
    Row.prototype.render = function () {
        this.$el.empty();
        var fragment = document.createDocumentFragment();
        this.cells.each(function (cell) {
            cell.validationEnabled(true);
            fragment.appendChild(cell.render().el);
        });
        this.el.appendChild(fragment);
        this.delegateEvents();
        return this;
    };
    Row.prototype.reset = function () {
    };
    return Row;
}(View_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Row;
