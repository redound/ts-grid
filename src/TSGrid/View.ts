///<reference path="Events.ts"/>


module TSGrid {

    /**
     * IMPORTANT: This should be a port from Backbone's View concept
     */
    export class View extends Events {

        public static DELEGATE_EVENT_SPLITTER = /^(\S+)\s*(.*)$/;

        // The default `tagName` of a View's element is `div`
        public tagName: string = 'div';

        public className: string;

        public attributes: any = {

        };

        public $el: JQuery;

        public el: HTMLElement;

        public id: number;

        public cid: string;

        /**
         * Creating a View creates its initial element outside of the DOM,
         * if an existing element is not provided.
         */
        public constructor() {

            super();

            this.cid = _.uniqueId('view');
        }

        /**
         * jQuery delegate for element lookup, scoped to DOM elements within the
         * current view. This should be preferred to global lookups where possible.
         * @param selector
         * @returns {JQuery}
         */
        public $(selector): JQuery {
            return this.$el.find(selector);
        }

        /**
         * Initialize needs to be called from the constructor. Extend it with your own
         * initialization logic.
         */
        public initialize() {
            this._ensureElement();
        }

        /**
         * **Render** is the core function that your view should override, in order
         * to populate its element (`this.el`), with the appropriate HTML. The
         * convention is for **render** to always return `this`.
         */
        public render(): View {
            return this;
        }

        /**
         * Remove this view by taking the element out of the DOM, and removing any
         * applicable event listeners
         */
        public remove() {
            this._removeElement();
            //this.stopListenening();
            return this;
        }

        /**
         * Remove this view's element from the document and all event listeners
         * attached to it. Exposed for subclasses using an alternative DOM
         * manipulation API.
         */
        private _removeElement() {
            this.$el.remove();
        }

        /**
         * Change the view's element (`this.el` property) and re-delegate the view's
         * events on the new element.
         * @param element
         * @returns {TSGrid.View}
         */
        public setElement(element: JQuery|HTMLElement): View {
            this.undelegateEvents();
            this._setElement(element);
            this.delegateEvents();
            return this;
        }

        /**
         * Creates the `this.el` and `this.$el` references for this view using the
         * given `el`. `el` can be a CSS selector or an HTML string, a jQuery
         * context or an element. Subclasses can override this to utilize an
         * alternative DOM manipulation API and are only required to set the
         * `this.el` property.
         * @param el
         * @private
         */
        protected _setElement(el: JQuery|HTMLElement) {
            this.$el = $(el);
            this.el = this.$el[0];
        }

        /**
         * Set callbacks, where `this.viewEvents` is a hash of
         *
         * *{"event selector": "callback"}*
         *
         * pairs. Callbacks will be bound to the view, with `this` set properly.
         * Uses event delegation for efficiency.
         * Omitting the selector binds the event to `this.el`.
         */
        public delegateEvents(events?: any) {
            events || (events = _.result(this, 'viewEvents'));
            if (!events) return this;
            this.undelegateEvents();
            for (var key in events) {
                var method = events[key];
                if (!_.isFunction(method)) method = this[method];
                if (!method) continue;
                var match = key.match(View.DELEGATE_EVENT_SPLITTER);
                this.delegate(match[1], match[2], _.bind(method, this));
            }
            return this;
        }

        /**
         * Add a single event listener to the view's element (or a child element using
         * `selector`). This only works for delegate-able events: `focus`, `blur`, and
         * not `change`, `submit` and `reset` in Internet Explorer
         * @param eventName
         * @param selector
         * @param listener
         * @returns {TSGrid.View}
         */
        public delegate(eventName: string, selector: string, listener) {
            this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
            return this;
        }

        public undelegateEvents() {
            if (this.$el) this.$el.off('.delegateEvents' + this.cid);
            return this;
        }

        public undelegate(eventName: string, selector: string, listener) {
            this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
            return this;
        }

        protected _createElement(tagName: string): HTMLElement {
            return document.createElement(tagName);
        }

        protected _ensureElement() {
            if (!this.el) {
                var attrs = _.extend({}, _.result(this, 'attributes'));
                if (this.id) attrs.id = _.result(this, 'id');
                if (this.className) attrs['class'] = _.result(this, 'className');
                this.setElement(this._createElement(_.result(this, 'tagName')));
                this._setAttributes(attrs);
            } else {
                this.setElement(_.result(this, 'el'));
            }
        }

        protected _setAttributes(attributes) {
            this.$el.attr(attributes);
        }
    }
}