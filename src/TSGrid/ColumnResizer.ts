module TSGrid {

    export class ColumnResizer extends TSCore.App.UI.View {

        public tagName: string = 'div';

        public className: string = 'manualColumnResizer';

        public viewEvents: any = {
            "mousedown": "mousedown",
            "mouseup": "mouseup"
        };

        public events: TSCore.Events.EventEmitter = new TSCore.Events.EventEmitter();

        protected _active: boolean = false;

        public constructor() {

            super();

            this.initialize();
        }

        protected mousedown() {

            this.events.trigger(TSGrid.ColumnResizerEvents.MOUSEDOWN, { columnResizer: this });
        }

        protected mouseup() {

            this.events.trigger(TSGrid.ColumnResizerEvents.MOUSEUP, { columnResizer: this });
        }

        public setActive(active: boolean): this {

            if (this._active !== active) {

                if (active) {
                    this.$el.addClass('active');
                } else {
                    this.$el.removeClass('active');
                }
            }

            this._active = active;
            return this;
        }

        public getActive() {
            return this._active;
        }
    }
}