import View from "./View";
export default class ColumnResizerGuide extends View {
    tagName: string;
    className: string;
    protected _active: boolean;
    constructor();
    setActive(active: boolean): this;
    getActive(): boolean;
}
