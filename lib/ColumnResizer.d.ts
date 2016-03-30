import View from "./View";
import EventEmitter from "ts-core/lib/Events/EventEmitter";
export declare const COLUMN_RESIZER_EVENTS: {
    MOUSEUP: string;
    MOUSEDOWN: string;
    DBLCLICK: string;
};
export default class ColumnResizer extends View {
    tagName: string;
    className: string;
    clicks: number;
    delay: number;
    viewEvents: any;
    events: EventEmitter;
    protected _active: boolean;
    constructor();
    protected mousedown(): void;
    protected mouseup(): void;
    setActive(active: boolean): this;
    getActive(): boolean;
}
