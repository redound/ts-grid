"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var View_1 = require("./View");
var EventEmitter_1 = require("ts-core/lib/Events/EventEmitter");
exports.COLUMN_RESIZER_EVENTS = {
    MOUSEUP: 'columnResizer:mouseup',
    MOUSEDOWN: 'columnResizer:mousedown',
    DBLCLICK: 'columnResizer:dblclick'
};
var ColumnResizer = (function (_super) {
    __extends(ColumnResizer, _super);
    function ColumnResizer() {
        _super.call(this);
        this.tagName = 'div';
        this.className = 'manualColumnResizer';
        this.clicks = 0;
        this.delay = 400;
        this.viewEvents = {
            "mousedown": "mousedown",
            "mouseup": "mouseup",
            "dblclick": "dblclick"
        };
        this.events = new EventEmitter_1.default();
        this._active = false;
        this.initialize();
    }
    ColumnResizer.prototype.mousedown = function () {
        var _this = this;
        event.preventDefault();
        this.clicks++;
        setTimeout(function () {
            _this.clicks = 0;
        }, this.delay);
        if (this.clicks === 2) {
            this.events.trigger(exports.COLUMN_RESIZER_EVENTS.DBLCLICK, { columnResizer: this });
            this.clicks = 0;
        }
        else {
            this.events.trigger(exports.COLUMN_RESIZER_EVENTS.MOUSEDOWN, { columnResizer: this });
        }
    };
    ColumnResizer.prototype.mouseup = function () {
        this.events.trigger(exports.COLUMN_RESIZER_EVENTS.MOUSEUP, { columnResizer: this });
    };
    ColumnResizer.prototype.setActive = function (active) {
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
    ColumnResizer.prototype.getActive = function () {
        return this._active;
    };
    return ColumnResizer;
}(View_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ColumnResizer;
