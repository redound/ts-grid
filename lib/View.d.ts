export default class View {
    static DELEGATE_EVENT_SPLITTER: RegExp;
    tagName: string;
    className: string;
    attributes: any;
    $el: JQuery;
    el: HTMLElement;
    id: number;
    cid: string;
    constructor();
    $(selector: any): JQuery;
    initialize(): void;
    render(): this;
    remove(): this;
    private _removeElement();
    setElement(element: JQuery | HTMLElement): View;
    protected _setElement(el: JQuery | HTMLElement): void;
    delegateEvents(events?: any): this;
    delegate(eventName: string, selector: string, listener: any): this;
    undelegateEvents(): this;
    undelegate(eventName: string, selector: string, listener: any): this;
    protected _createElement(tagName: string): HTMLElement;
    protected _ensureElement(): void;
    protected _setAttributes(attributes: any): void;
}
