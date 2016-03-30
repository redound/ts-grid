import View from "./View";
import Header from "./Header";
import { Body } from "./Body";
import List from "ts-core/lib/Data/List";
import Column from "./Column";
import EventEmitter from "ts-core/lib/Events/EventEmitter";
import ColumnResizer from "./ColumnResizer";
import ColumnResizerGuide from "./ColumnResizerGuide";
import HeaderCell from "./HeaderCell";
import { SortedListDirection } from "ts-core/lib/Data/SortedList";
export declare const GRID_EVENTS: {
    RENDERED: string;
    REFRESH: string;
    SORT: string;
    EDIT: string;
    EDITING: string;
    EDITED: string;
    ERROR: string;
    NEXT: string;
    NAVIGATE: string;
    CHANGED_WIDTH: string;
    CLICK: string;
};
export default class Grid extends View {
    tagName: string;
    className: string;
    protected _header: Header;
    protected _body: Body;
    protected _columns: List<Column>;
    protected _width: number;
    events: EventEmitter;
    protected _columnResizer: ColumnResizer;
    protected _columnResizerGuide: ColumnResizerGuide;
    mousePageOffsetX: number;
    columnResizeStartOffsetX: number;
    protected _lastHeaderCell: HeaderCell;
    protected _resizeHeaderCell: HeaderCell;
    constructor(header: Header, body: Body, columns: List<Column>);
    initialize(): void;
    protected documentOnMouseLeave(e: any): void;
    protected resetColumnResizer(): void;
    protected documentOnMouseMove(e: any): void;
    protected positionColumnResizer(offsetX?: number): void;
    protected documentOnMouseUp(e: any): void;
    protected createColumnResizer(): void;
    protected columnResizerOnMouseDown(e: any): void;
    protected columnResizerOnDoubleClick(e: any): void;
    sort(sortPredicate: any, sortDirection: SortedListDirection): void;
    protected afterSort(sortPredicate: any, sortDirection: SortedListDirection): void;
    setHeader(header: Header): this;
    getHeader(): Header;
    setBody(body: Body): this;
    getBody(): Body;
    setColumns(columns: List<Column>): this;
    calculateWidth(): void;
    getColumns(): List<Column>;
    getInnerWidth(): number;
    getWidth(): number;
    render(): this;
    protected listenHeaderCells(): void;
    protected columnChangedWidth(e: any): void;
    protected headerCellOnClick(e: any): void;
    protected headerCellOnMouseEnter(e: any): void;
    protected headerCellOnMouseLeave(e: any): void;
    protected positionColumnResizerAtHeaderCell(headerCell: HeaderCell): void;
    protected sortName(name: string): void;
    remove(): this;
}
