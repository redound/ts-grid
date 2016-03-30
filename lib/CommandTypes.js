"use strict";
(function (CommandTypes) {
    CommandTypes[CommandTypes["NONE"] = 0] = "NONE";
    CommandTypes[CommandTypes["UP"] = 1] = "UP";
    CommandTypes[CommandTypes["DOWN"] = 2] = "DOWN";
    CommandTypes[CommandTypes["LEFT"] = 3] = "LEFT";
    CommandTypes[CommandTypes["RIGHT"] = 4] = "RIGHT";
    CommandTypes[CommandTypes["TAB"] = 5] = "TAB";
    CommandTypes[CommandTypes["SHIFT_TAB"] = 6] = "SHIFT_TAB";
    CommandTypes[CommandTypes["ENTER"] = 7] = "ENTER";
    CommandTypes[CommandTypes["BACKSPACE"] = 8] = "BACKSPACE";
    CommandTypes[CommandTypes["DELETE"] = 9] = "DELETE";
    CommandTypes[CommandTypes["BLUR"] = 10] = "BLUR";
    CommandTypes[CommandTypes["ESC"] = 11] = "ESC";
})(exports.CommandTypes || (exports.CommandTypes = {}));
var CommandTypes = exports.CommandTypes;
