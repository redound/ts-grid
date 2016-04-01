"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var View_1 = require("./View");
var CellEditor_1 = require("./CellEditor");
var EventEmitter_1 = require("ts-core/lib/Events/EventEmitter");
var utils_1 = require("./utils");
var Command_1 = require("./Command");
var Grid_1 = require("./Grid");
var $ = require("jquery");
exports.CELL_EVENTS = {
    CHANGED: 'cell:changed',
    CLEARED: 'cell:cleared'
};
var Cell = (function (_super) {
    __extends(Cell, _super);
    function Cell(column, model) {
        _super.call(this);
        this.tagName = 'td';
        this.editModeActive = false;
        this.viewEvents = {
            "click": "click",
            "keypress": "keypress",
            "keydown": "keydown"
        };
        this.events = new EventEmitter_1.default();
        this.activated = false;
        this._validationEnabled = false;
        this.column = column;
        this.model = model;
        this.initialize();
    }
    Cell.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        if (utils_1.callByNeed(this.column.getEditable(), this.column, this.model))
            this.$el.addClass("editable");
        if (utils_1.callByNeed(this.column.getRenderable(), this.column, this.model))
            this.$el.addClass("renderable");
    };
    Cell.prototype.validationEnabled = function (validationEnabled) {
        if (validationEnabled === void 0) { validationEnabled = true; }
        this._validationEnabled = validationEnabled;
        return this;
    };
    Cell.prototype.getValidationEnabled = function () {
        return this._validationEnabled;
    };
    Cell.prototype.setModelValue = function (value) {
        var setter = this.column.getSetter();
        if (setter) {
            setter(this.model, value);
        }
        else {
            this.model.set(this.column.getName(), value);
        }
        return this;
    };
    Cell.prototype.getModelValue = function () {
        var getter = this.column.getGetter();
        if (getter) {
            return getter(this.model);
        }
        return this.model.get(this.column.getName());
    };
    Cell.prototype.getContentWidth = function () {
        return this.$cellLabel.width();
    };
    Cell.prototype.render = function () {
        this.$el.empty();
        var formatter = this.column.getFormatter();
        var getter = this.column.getGetter();
        var modelValue = getter ? getter(this.model) : this.model.get(this.column.getName());
        var value = formatter ? formatter(this.model, this) : modelValue;
        this.$cellLabel = $('<span class="cell-label"></span>');
        this.$cellLabel.html(value);
        this.$el.append(this.$cellLabel);
        var columnClassName = this.column.getClassName();
        if (columnClassName) {
            this.$el.addClass(columnClassName);
        }
        if (this.getValidationEnabled() && this.model.isValid(this.column.getName()) === false && this.model.isDirty(this.column.getName()) === true) {
            this.$el.addClass('warning-state');
        }
        else {
            this.$el.removeClass('warning-state');
        }
        this.delegateEvents();
        return this;
    };
    Cell.prototype.keypress = function (evt) {
        var cellInput = Cell.CELL_INPUT.indexOf(evt.keyCode) !== -1;
        if (this.column.getEditOnInput() && cellInput && !evt.metaKey && !evt.ctrlKey) {
            var char = String.fromCharCode(evt.keyCode);
            this.enterEditMode(char);
        }
    };
    Cell.prototype.keydown = function (evt) {
        var cmd = Command_1.default.fromEvent(evt);
        if (cmd.enter()) {
            this.enterEditMode();
        }
        if (cmd.backspace() || cmd.delete()) {
            evt.preventDefault();
            evt.stopPropagation();
            if (this.column.getAllowClear()) {
                this.clear();
                this.activate();
            }
        }
        if (cmd.left() || cmd.right() || cmd.up() || cmd.down() || cmd.shiftTab() || cmd.tab()) {
            evt.preventDefault();
            var grid = this.column.getGrid();
            grid.events.trigger(Grid_1.GRID_EVENTS.NAVIGATE, {
                column: this.column,
                model: this.model,
                command: cmd
            });
        }
    };
    Cell.prototype.click = function (event) {
        var grid = this.column.getGrid();
        grid.events.trigger(Grid_1.GRID_EVENTS.CLICK, {
            column: this.column,
            model: this.model,
            event: event
        });
    };
    Cell.prototype.blur = function () {
        this.$el.removeClass('active');
        this.$el.removeAttr('tabindex');
    };
    Cell.prototype.activate = function () {
        this.$el.attr('tabindex', 0);
        this.$el.addClass('active');
        this.$el.focus();
        this.activated = true;
    };
    Cell.prototype.isActivated = function () {
        return this.activated;
    };
    Cell.prototype.deactivate = function () {
        if (this.editModeActive) {
            this.exitEditMode();
        }
        this.blur();
        this.activated = false;
    };
    Cell.prototype.clear = function () {
        var onClear = this.column.getOnClear();
        var setter = this.column.getSetter();
        if (onClear) {
            onClear(this.model);
        }
        else if (setter) {
            setter(this.model, null);
        }
        else {
            this.model.set(this.column.getName(), null);
        }
        this.events.trigger(exports.CELL_EVENTS.CLEARED, { cell: this });
    };
    Cell.prototype.enterEditMode = function (withModelValue) {
        var _this = this;
        if (this.editModeActive)
            return;
        var editable = utils_1.callByNeed(this.column.getEditable(), this.column, this.model);
        if (editable) {
            var editorFactory = this.column.getEditor();
            this.currentEditor = editorFactory(this, this.column, this.model);
            this.model.events.trigger(Grid_1.GRID_EVENTS.EDIT, {
                model: this.model,
                column: this.column,
                cell: this,
                editor: this.currentEditor
            });
            this.undelegateEvents();
            if (withModelValue) {
                this.currentEditor.setInitialModelValue(withModelValue);
            }
            this.currentEditor.events.on(CellEditor_1.CELL_EDITOR_EVENTS.SAVE, function (e) { return _this.cellEditorOnSave(e); });
            this.currentEditor.events.on(CellEditor_1.CELL_EDITOR_EVENTS.CANCEL, function (e) { return _this.cellEditorOnCancel(e); });
            this.currentEditor.render();
            setTimeout(function () {
                _this.blur();
                _this.$el.empty();
                _this.$el.append(_this.currentEditor.$el);
                _this.$el.addClass('editor');
                _this.$el.addClass(_this.currentEditor.getEditorName());
            }, 10);
            this.editModeActive = true;
            this.model.events.trigger(Grid_1.GRID_EVENTS.EDITING, {
                model: this.model,
                column: this.column,
                cell: this,
                editor: this.currentEditor
            });
        }
    };
    Cell.prototype.cellEditorOnSave = function (e) {
        var modelValue = e.params.modelValue;
        this.setModelValue(modelValue);
        this.events.trigger(exports.CELL_EVENTS.CHANGED, e.params);
        var grid = this.column.getGrid();
        grid.events.trigger(Grid_1.GRID_EVENTS.EDITED, e.params);
    };
    Cell.prototype.cellEditorOnCancel = function (e) {
        var grid = this.column.getGrid();
        grid.events.trigger(Grid_1.GRID_EVENTS.EDITED, e.params);
    };
    Cell.prototype.exitEditMode = function () {
        this.editModeActive = false;
        this.$el.removeClass("error");
        this.$el.removeClass(this.currentEditor.getEditorName());
        this.currentEditor.remove();
        delete this.currentEditor;
        this.$el.removeClass("editor");
        this.render();
    };
    Cell.prototype.remove = function () {
        if (this.currentEditor) {
            this.currentEditor.remove.apply(this.currentEditor, arguments);
            delete this.currentEditor;
        }
        return this;
    };
    Cell.CELL_INPUT = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 167, 177, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 91, 92, 93, 94, 95, 96, 97, 98, 99, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90];
    return Cell;
}(View_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Cell;
