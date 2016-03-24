module TSGrid {

    export class ColumnResizer extends TSCore.App.UI.View {

        public tagName: string = 'div';

        public className: string = 'manualColumnResizer';

        public clicks: number = 0;

        public delay: number = 400;

        public viewEvents: any = {
            "mousedown": "mousedown",
            "mouseup": "mouseup",
            "dblclick": "dblclick"
        };

        public events: TSCore.Events.EventEmitter = new TSCore.Events.EventEmitter();

        protected _active: boolean = false;

        public constructor() {

            super();

            this.initialize();
        }

        protected mousedown() {

            event.preventDefault();
            this.clicks++;

            setTimeout(() => {
                this.clicks = 0;
            }, this.delay);

            if (this.clicks === 2) {
                this.events.trigger(TSGrid.ColumnResizerEvents.DBLCLICK, { columnResizer: this });
                this.clicks = 0;
            } else {
                this.events.trigger(TSGrid.ColumnResizerEvents.MOUSEDOWN, { columnResizer: this });
            }
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
