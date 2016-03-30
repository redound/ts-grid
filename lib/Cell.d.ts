import Column from "./Column";
import ActiveModel from "ts-data/lib/Model/ActiveModel";
import View from "./View";
import CellEditor from "./CellEditor";
import EventEmitter from "ts-core/lib/Events/EventEmitter";
export declare const CELL_EVENTS: {
    CHANGED: string;
    CLEARED: string;
};
export interface CellInterface {
    new (column: Column, model: ActiveModel): Cell;
}
export default class Cell extends View {
    static CELL_INPUT: number[];
    tagName: string;
    editModeActive: boolean;
    currentEditor: CellEditor;
    viewEvents: {
        "click": string;
        "keypress": string;
        "keydown": string;
    };
    events: EventEmitter;
    column: Column;
    model: ActiveModel;
    activated: boolean;
    protected _validationEnabled: boolean;
    $cellLabel: JQuery;
    constructor(column: Column, model: ActiveModel);
    initialize(): void;
    validationEnabled(validationEnabled?: boolean): this;
    getValidationEnabled(): boolean;
    setModelValue(value: any): this;
    getModelValue(): any;
    getContentWidth(): number;
    render(): this;
    protected keypress(evt: any): void;
    protected keydown(evt: any): void;
    protected click(event: any): void;
    protected blur(): void;
    activate(): void;
    isActivated(): boolean;
    deactivate(): void;
    clear(): void;
    enterEditMode(withModelValue?: any): void;
    protected cellEditorOnSave(e: any): void;
    protected cellEditorOnCancel(e: any): void;
    exitEditMode(): void;
    remove(): this;
}
