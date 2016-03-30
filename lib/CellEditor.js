"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var View_1 = require("./View");
var EventEmitter_1 = require("ts-core/lib/Events/EventEmitter");
exports.CELL_EDITOR_EVENTS = {
    SAVE: 'cellEditor:save',
    CANCEL: 'cellEditor:cancel'
};
var CellEditor = (function (_super) {
    __extends(CellEditor, _super);
    function CellEditor(column, model, editorName) {
        _super.call(this);
        this.events = new EventEmitter_1.default();
        this.setColumn(column);
        this.setModel(model);
        this.setEditorName(editorName);
        this.initialize();
    }
    CellEditor.prototype.setColumn = function (column) {
        this.column = column;
        return this;
    };
    CellEditor.prototype.getColumn = function () {
        return this.column;
    };
    CellEditor.prototype.setModel = function (model) {
        this.model = model;
        return this;
    };
    CellEditor.prototype.getModel = function () {
        return this.model;
    };
    CellEditor.prototype.setEditorName = function (editorName) {
        this.editorName = editorName;
        return this;
    };
    CellEditor.prototype.getEditorName = function () {
        return this.editorName;
    };
    CellEditor.prototype.setInitialModelValue = function (value) {
        this.initialModelValue = value;
        return this;
    };
    CellEditor.prototype.getInitialModelValue = function () {
        return this.initialModelValue;
    };
    CellEditor.prototype.getModelValue = function () {
        var getter = this.column.getGetter();
        if (getter) {
            return getter(this.model);
        }
        return this.model.get(this.column.getName());
    };
    CellEditor.prototype.save = function (cmd, value) {
        var model = this.model;
        var column = this.column;
        var editedEvent = {
            modelValue: value,
            model: model,
            column: column,
            command: cmd,
        };
        this.events.trigger(exports.CELL_EDITOR_EVENTS.SAVE, editedEvent);
    };
    CellEditor.prototype.cancel = function (cmd) {
        var model = this.model;
        var column = this.column;
        var editedEvent = {
            model: model,
            column: column,
            command: cmd
        };
        this.events.trigger(exports.CELL_EDITOR_EVENTS.CANCEL, editedEvent);
    };
    return CellEditor;
}(View_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CellEditor;
