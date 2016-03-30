"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var View_1 = require("./View");
var ColumnResizerGuide = (function (_super) {
    __extends(ColumnResizerGuide, _super);
    function ColumnResizerGuide() {
        _super.call(this);
        this.tagName = 'div';
        this.className = 'manualColumnResizerGuide';
        this._active = false;
        this.initialize();
    }
    ColumnResizerGuide.prototype.setActive = function (active) {
        if (this._active !== active) {
            if (active) {
                this.$el.addClass('active');
            }
            else {
                this.$el.removeClass('active');
            }
        }
        this._active = active;
        return this;
    };
    ColumnResizerGuide.prototype.getActive = function () {
        return this._active;
    };
    return ColumnResizerGuide;
}(View_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ColumnResizerGuide;
