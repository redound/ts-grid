import Column from "./Column";
import ActiveModel from "ts-data/lib/Model/ActiveModel";
import View from "./View";
import EventEmitter from "ts-core/lib/Events/EventEmitter";
import Command from "./Command";

export const CELL_EDITOR_EVENTS = {
    SAVE: 'cellEditor:save',
    CANCEL: 'cellEditor:cancel'
};

export interface CellEditorInterface {
    new (column:Column, model:ActiveModel):CellEditor;
}

export default class CellEditor extends View {

    protected column:Column;

    protected model:ActiveModel;

    protected editorName:string;

    protected initialModelValue:any;

    public events:EventEmitter = new EventEmitter();

    public constructor(column:Column, model:ActiveModel, editorName:string) {
        super();
        this.setColumn(column);
        this.setModel(model);
        this.setEditorName(editorName);
        this.initialize();
    }

    /**
     * Set the column.
     * @param column
     * @returns {TSGrid.CellEditor}
     * @chainable
     */
    public setColumn(column:Column):this {
        this.column = column;
        return this;
    }

    /**
     * Get the column.
     * @returns {Column}
     */
    public getColumn():Column {
        return this.column;
    }

    /**
     * Set the model.
     * @param model
     * @returns {TSGrid.CellEditor}
     * @chainable
     */
    public setModel(model:ActiveModel):this {
        this.model = model;
        return this;
    }

    /**
     * Get the model.
     * @returns {ActiveModel}
     */
    public getModel():ActiveModel {
        return this.model;
    }

    /**
     * Set the editorName.
     * @param editorName
     * @returns {TSGrid.CellEditor}
     * @chainable
     */
    public setEditorName(editorName:string):this {
        this.editorName = editorName;
        return this;
    }

    /**
     * Get the editorName.
     * @returns {string}
     */
    public getEditorName():string {
        return this.editorName;
    }

    /**
     * Set the initialModelValue.
     * @param value
     * @chainable
     */
    public setInitialModelValue(value:any):this {
        this.initialModelValue = value;
        return this;
    }

    /**
     * Get the initialModelValue.
     * @returns {any}
     */
    public getInitialModelValue():any {
        return this.initialModelValue;
    }

    /**
     * Get the modelValue.
     * @returns {*|any}
     */
    public getModelValue():any {

        var getter = this.column.getGetter();

        if (getter) {
            return getter(this.model);
        }

        return this.model.get(this.column.getName());
    }

    /**
     * Set's the updated modelValue, than triggers
     * TSGridEvents.EDITED event on the grid and model.
     *
     * @param action Action on which the save action is based.
     * @param value The updated modelValue
     */
    public save(cmd:Command, value:any) {

        var model = this.model;
        var column = this.column;

        var editedEvent = {
            modelValue: value,
            model: model,
            column: column,
            command: cmd,
        };

        this.events.trigger(CELL_EDITOR_EVENTS.SAVE, editedEvent);
    }

    /**
     * Cancel editing.
     *
     * @param action Action on which the cancel action is based.
     */
    public cancel(cmd:Command) {

        var model = this.model;
        var column = this.column;

        var editedEvent = {
            model: model,
            column: column,
            command: cmd
        };

        this.events.trigger(CELL_EDITOR_EVENTS.CANCEL, editedEvent);
    }
}
