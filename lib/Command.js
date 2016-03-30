"use strict";
var CommandTypes_1 = require("./CommandTypes");
var KeyCodes_1 = require("angularjs-kit/lib/KeyCodes");
var Command = (function () {
    function Command() {
    }
    Command.prototype.type = function (type) {
        this._type = type;
    };
    Command.prototype.fromEvent = function (evt) {
        switch (true) {
            case (evt.type === 'blur'):
                this._type = CommandTypes_1.CommandTypes.BLUR;
                break;
            case (evt.keyCode === KeyCodes_1.default.UP):
                this._type = CommandTypes_1.CommandTypes.UP;
                break;
            case (evt.keyCode === KeyCodes_1.default.DOWN):
                this._type = CommandTypes_1.CommandTypes.DOWN;
                break;
            case (evt.shiftKey && evt.keyCode === KeyCodes_1.default.TAB):
                this._type = CommandTypes_1.CommandTypes.SHIFT_TAB;
                break;
            case (evt.keyCode === KeyCodes_1.default.LEFT):
                this._type = CommandTypes_1.CommandTypes.LEFT;
                break;
            case (!evt.shiftKey && evt.keyCode === KeyCodes_1.default.TAB):
                this._type = CommandTypes_1.CommandTypes.TAB;
                break;
            case (evt.keyCode === KeyCodes_1.default.RIGHT):
                this._type = CommandTypes_1.CommandTypes.RIGHT;
                break;
            case (!evt.shiftKey && evt.keyCode === KeyCodes_1.default.ENTER):
                this._type = CommandTypes_1.CommandTypes.ENTER;
                break;
            case (evt.keyCode === KeyCodes_1.default.BACKSPACE):
                this._type = CommandTypes_1.CommandTypes.BACKSPACE;
                break;
            case (evt.keyCode === KeyCodes_1.default.DELETE):
                this._type = CommandTypes_1.CommandTypes.DELETE;
                break;
            case (evt.keyCode === KeyCodes_1.default.ESCAPE):
                this._type = CommandTypes_1.CommandTypes.ESC;
                break;
            default:
                this._type = CommandTypes_1.CommandTypes.NONE;
                break;
        }
    };
    Command.prototype.blur = function () {
        return this._type === CommandTypes_1.CommandTypes.BLUR;
    };
    Command.prototype.up = function () {
        return this._type === CommandTypes_1.CommandTypes.UP;
    };
    Command.prototype.down = function () {
        return this._type === CommandTypes_1.CommandTypes.DOWN;
    };
    Command.prototype.left = function () {
        return this._type === CommandTypes_1.CommandTypes.LEFT;
    };
    Command.prototype.right = function () {
        return this._type === CommandTypes_1.CommandTypes.RIGHT;
    };
    Command.prototype.shiftTab = function () {
        return this._type === CommandTypes_1.CommandTypes.SHIFT_TAB;
    };
    Command.prototype.tab = function () {
        return this._type === CommandTypes_1.CommandTypes.TAB;
    };
    Command.prototype.enter = function () {
        return this._type === CommandTypes_1.CommandTypes.ENTER;
    };
    Command.prototype.backspace = function () {
        return this._type === CommandTypes_1.CommandTypes.BACKSPACE;
    };
    Command.prototype.delete = function () {
        return this._type === CommandTypes_1.CommandTypes.DELETE;
    };
    Command.prototype.esc = function () {
        return this._type === CommandTypes_1.CommandTypes.ESC;
    };
    Command.fromEvent = function (evt) {
        var command = new Command();
        command.fromEvent(evt);
        return command;
    };
    Command.fromType = function (type) {
        var command = new Command();
        command.type(type);
        return command;
    };
    return Command;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Command;
