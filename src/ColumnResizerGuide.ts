import View from "./View";

export default class ColumnResizerGuide extends View {

    public tagName:string = 'div';

    public className:string = 'manualColumnResizerGuide';

    protected _active:boolean = false;

    public constructor() {

        super();

        this.initialize();
    }

    public setActive(active:boolean):this {

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
