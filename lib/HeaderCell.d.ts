import View from "./View";
import HeaderRow from "./HeaderRow";
import Column from "./Column";
import EventEmitter from "ts-core/lib/Events/EventEmitter";
import { SortedListDirection } from "ts-core/lib/Data/SortedList";
export declare const HEADER_CELL_EVENTS: {
    CLICK: string;
    MOUSEENTER: string;
    MOUSELEAVE: string;
};
export interface HeaderCellInterface {
    new (column: Column): HeaderCell;
}
export default class HeaderCell extends View {
    tagName: string;
    viewEvents: any;
    row: HeaderRow;
    column: Column;
    events: EventEmitter;
    protected sortDirection: SortedListDirection;
    constructor(column: Column);
    initialize(): void;
    protected columnChangedWidth(e: any): void;
    protected click(): void;
    protected mouseenter(): void;
    protected mouseleave(): void;
    setSortDirection(direction: SortedListDirection): void;
    render(): this;
}
