import Column from "./Column";
import ActiveModel from "ts-data/lib/Model/ActiveModel";
import View from "./View";
import EventEmitter from "ts-core/lib/Events/EventEmitter";
import Command from "./Command";
export declare const CELL_EDITOR_EVENTS: {
    SAVE: string;
    CANCEL: string;
};
export interface CellEditorInterface {
    new (column: Column, model: ActiveModel): CellEditor;
}
export default class CellEditor extends View {
    protected column: Column;
    protected model: ActiveModel;
    protected editorName: string;
    protected initialModelValue: any;
    events: EventEmitter;
    constructor(column: Column, model: ActiveModel, editorName: string);
    setColumn(column: Column): this;
    getColumn(): Column;
    setModel(model: ActiveModel): this;
    getModel(): ActiveModel;
    setEditorName(editorName: string): this;
    getEditorName(): string;
    setInitialModelValue(value: any): this;
    getInitialModelValue(): any;
    getModelValue(): any;
    save(cmd: Command, value: any): void;
    cancel(cmd: Command): void;
}
