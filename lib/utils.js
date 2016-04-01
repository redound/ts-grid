"use strict";
var _ = require("underscore");
function callByNeed() {
    var arg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arg[_i - 0] = arguments[_i];
    }
    var value = arguments[0];
    if (!_.isFunction(value))
        return value;
    var context = arguments[1];
    var args = [].slice.call(arguments, 2);
    return value.apply(context, !!(args + '') ? args : []);
}
exports.callByNeed = callByNeed;
