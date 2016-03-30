"use strict";
var Cell_1 = require("./Cell");
var EventEmitter_1 = require("ts-core/lib/Events/EventEmitter");
var HeaderCell_1 = require("./HeaderCell");
exports.COLUMN_EVENTS = {
    CHANGED_WIDTH: 'column:changedWidth'
};
var Column = (function () {
    function Column() {
        this._resizable = false;
        this._renderable = true;
        this._editOnInput = false;
        this._editable = false;
        this._sortable = false;
        this._allowClear = false;
        this._cellType = Cell_1.default;
        this.events = new EventEmitter_1.default();
        this._uniqId = parseInt(_.uniqueId());
    }
    Column.prototype.descriptionFormatter = function (descriptionFormatter) {
        this._descriptionFormatter = descriptionFormatter;
        return this;
    };
    Column.prototype.getDescriptionFormatter = function () {
        return this._descriptionFormatter;
    };
    Column.prototype.getDescription = function () {
        if (this._descriptionFormatter) {
            return this._descriptionFormatter(this);
        }
        return null;
    };
    Column.prototype.className = function (className) {
        this._className = className;
        return this;
    };
    Column.prototype.getClassName = function () {
        return this._className;
    };
    Column.prototype.getId = function () {
        return this._uniqId;
    };
    Column.prototype.setGrid = function (grid) {
        this._grid = grid;
    };
    Column.prototype.getGrid = function () {
        return this._grid;
    };
    Column.prototype.resizable = function (resizable) {
        if (resizable === void 0) { resizable = true; }
        this._resizable = resizable;
        return this;
    };
    Column.prototype.getResizable = function () {
        return this._resizable;
    };
    Column.prototype.minWidth = function (minWidth) {
        this._minWidth = minWidth;
        return this;
    };
    Column.prototype.getMinWidth = function () {
        return this._minWidth;
    };
    Column.prototype.maxWidth = function (maxWidth) {
        this._maxWidth = maxWidth;
        return this;
    };
    Column.prototype.getMaxWidth = function () {
        return this._maxWidth;
    };
    Column.prototype.width = function (width) {
        var oldWidth = this._width;
        this._width = width;
        this.events.trigger(exports.COLUMN_EVENTS.CHANGED_WIDTH, { column: this, fromWidth: oldWidth, toWidth: width });
        return this;
    };
    Column.prototype.getWidth = function () {
        return this._width;
    };
    Column.prototype.name = function (name) {
        this._name = name;
        return this;
    };
    Column.prototype.getName = function () {
        return this._name;
    };
    Column.prototype.titleFormatter = function (title) {
        this._titleFormatter = title;
        return this;
    };
    Column.prototype.getTitleFormatter = function () {
        return this._titleFormatter;
    };
    Column.prototype.getTitle = function () {
        return this._titleFormatter(this);
    };
    Column.prototype.renderable = function (renderable) {
        this._renderable = renderable;
        return this;
    };
    Column.prototype.getRenderable = function () {
        return this._renderable;
    };
    Column.prototype.editable = function (editable) {
        if (editable === void 0) { editable = true; }
        this._editable = editable;
        return this;
    };
    Column.prototype.getEditable = function () {
        return this._editable;
    };
    Column.prototype.sortable = function (sortable) {
        if (sortable === void 0) { sortable = true; }
        this._sortable = sortable;
        return this;
    };
    Column.prototype.getSortable = function () {
        return this._sortable;
    };
    Column.prototype.editOnInput = function (editOnInput) {
        if (editOnInput === void 0) { editOnInput = true; }
        this._editOnInput = editOnInput;
        return this;
    };
    Column.prototype.getEditOnInput = function () {
        return this._editOnInput;
    };
    Column.prototype.getHeaderType = function () {
        return HeaderCell_1.default;
    };
    Column.prototype.editor = function (editor) {
        this._editor = editor;
        return this;
    };
    Column.prototype.getEditor = function () {
        return this._editor;
    };
    Column.prototype.allowClear = function (allowClear) {
        if (allowClear === void 0) { allowClear = true; }
        this._allowClear = allowClear;
        return this;
    };
    Column.prototype.getAllowClear = function () {
        return this._allowClear;
    };
    Column.prototype.onClear = function (onClear) {
        this._onClear = onClear;
        return this;
    };
    Column.prototype.getOnClear = function () {
        return this._onClear;
    };
    Column.prototype.cellType = function (cellType) {
        this._cellType = cellType;
        return this;
    };
    Column.prototype.getCellType = function () {
        return this._cellType;
    };
    Column.prototype.setter = function (setter) {
        this._setter = setter;
        return this;
    };
    Column.prototype.getSetter = function () {
        return this._setter;
    };
    Column.prototype.getter = function (getter) {
        this._getter = getter;
        return this;
    };
    Column.prototype.getGetter = function () {
        return this._getter;
    };
    Column.prototype.parser = function (parser) {
        this._parser = parser;
        return this;
    };
    Column.prototype.getParser = function () {
        return this._parser;
    };
    Column.prototype.formatter = function (formatter) {
        this._formatter = formatter;
        return this;
    };
    Column.prototype.getFormatter = function () {
        return this._formatter;
    };
    return Column;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Column;
