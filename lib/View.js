"use strict";
var _ = require("underscore");
var $ = require("jquery");
var View = (function () {
    function View() {
        this.tagName = 'div';
        this.attributes = {};
        this.cid = _.uniqueId('view');
    }
    View.prototype.$ = function (selector) {
        return this.$el.find(selector);
    };
    View.prototype.initialize = function () {
        this._ensureElement();
    };
    View.prototype.render = function () {
        return this;
    };
    View.prototype.remove = function () {
        this._removeElement();
        return this;
    };
    View.prototype._removeElement = function () {
        this.$el.remove();
    };
    View.prototype.setElement = function (element) {
        this.undelegateEvents();
        this._setElement(element);
        this.delegateEvents();
        return this;
    };
    View.prototype._setElement = function (el) {
        this.$el = $(el);
        this.el = this.$el[0];
    };
    View.prototype.delegateEvents = function (events) {
        events || (events = _.result(this, 'viewEvents'));
        if (!events)
            return this;
        this.undelegateEvents();
        for (var key in events) {
            var method = events[key];
            if (!_.isFunction(method))
                method = this[method];
            if (!method)
                continue;
            var match = key.match(View.DELEGATE_EVENT_SPLITTER);
            this.delegate(match[1], match[2], _.bind(method, this));
        }
        return this;
    };
    View.prototype.delegate = function (eventName, selector, listener) {
        this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
        return this;
    };
    View.prototype.undelegateEvents = function () {
        if (this.$el)
            this.$el.off('.delegateEvents' + this.cid);
        return this;
    };
    View.prototype.undelegate = function (eventName, selector, listener) {
        this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
        return this;
    };
    View.prototype._createElement = function (tagName) {
        return document.createElement(tagName);
    };
    View.prototype._ensureElement = function () {
        if (!this.el) {
            var attrs = _.extend({}, _.result(this, 'attributes'));
            if (this.id)
                attrs.id = _.result(this, 'id');
            if (this.className)
                attrs['class'] = _.result(this, 'className');
            this.setElement(this._createElement(_.result(this, 'tagName')));
            this._setAttributes(attrs);
        }
        else {
            this.setElement(_.result(this, 'el'));
        }
    };
    View.prototype._setAttributes = function (attributes) {
        this.$el.attr(attributes);
    };
    View.DELEGATE_EVENT_SPLITTER = /^(\S+)\s*(.*)$/;
    return View;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = View;
