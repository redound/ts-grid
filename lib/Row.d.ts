import List from "ts-core/lib/Data/List";
import ActiveModel from "ts-data/lib/Model/ActiveModel";
import Column from "./Column";
import View from "./View";
import EventEmitter from "ts-core/lib/Events/EventEmitter";
import Cell from "./Cell";
export interface RowInterface {
    new (columns: List<Column>, model: ActiveModel): Row;
}
export declare const ROW_EVENTS: {
    CHANGED: string;
};
export default class Row extends View {
    tagName: string;
    columns: List<Column>;
    modelId: any;
    model: ActiveModel;
    cells: List<Cell>;
    events: EventEmitter;
    protected _active: any;
    protected _loading: any;
    valid: boolean;
    constructor(columns: List<Column>, model: ActiveModel);
    initialize(): void;
    setLoading(loading: boolean): void;
    setActive(active: boolean): void;
    setModel(model: ActiveModel): this;
    makeCell(column: Column): Cell;
    protected cellDidChange(e: any): void;
    protected cellDidClear(e: any): void;
    render(): this;
    reset(): void;
}
