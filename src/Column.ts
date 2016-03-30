import Grid from "./Grid";
import {CellInterface, default as Cell} from "./Cell";
import EventEmitter from "ts-core/lib/Events/EventEmitter";
import HeaderCell, {HeaderCellInterface} from "./HeaderCell";

export const COLUMN_EVENTS = {
    CHANGED_WIDTH: 'column:changedWidth'
};

export default class Column {

    protected _uniqId:number;

    protected _grid:Grid;

    protected _resizable:boolean = false;

    protected _minWidth:number;

    protected _maxWidth:number;

    protected _width:number;

    protected _name:string;

    protected _titleFormatter:any;

    protected _descriptionFormatter:any;

    protected _renderable:boolean = true;

    protected _editOnInput:boolean = false;

    protected _editable:boolean = false;

    protected _sortable:boolean = false;

    protected _editor:any;

    protected _onClear:any;

    protected _allowClear:boolean = false;

    protected _setter:any;

    protected _getter:any;

    protected _parser:any;

    protected _formatter:any;

    protected _cellType:CellInterface = Cell;

    protected _className:string;

    public events:EventEmitter = new EventEmitter();

    public constructor() {

        this._uniqId = parseInt(<any>_.uniqueId());
    }

    public descriptionFormatter(descriptionFormatter:any):this {

        this._descriptionFormatter = descriptionFormatter;
        return this;
    }

    public getDescriptionFormatter() {

        return this._descriptionFormatter;
    }

    public getDescription():string {

        if (this._descriptionFormatter) {
            return this._descriptionFormatter(this);
        }

        return null;
    }

    public className(className:string):this {
        this._className = className;
        return this;
    }

    public getClassName():string {
        return this._className;
    }

    public getId() {
        return this._uniqId;
    }

    public setGrid(grid:Grid) {
        this._grid = grid;
    }

    public getGrid():Grid {
        return this._grid;
    }

    public resizable(resizable:boolean = true):this {
        this._resizable = resizable;
        return this;
    }

    public getResizable():boolean {
        return this._resizable;
    }

    public minWidth(minWidth:number):this {
        this._minWidth = minWidth;
        return this;
    }

    public getMinWidth():number {
        return this._minWidth;
    }

    public maxWidth(maxWidth:number):this {
        this._maxWidth = maxWidth;
        return this;
    }

    public getMaxWidth():number {
        return this._maxWidth;
    }

    public width(width:number):this {
        var oldWidth = this._width;
        this._width = width;
        this.events.trigger(COLUMN_EVENTS.CHANGED_WIDTH, {column: this, fromWidth: oldWidth, toWidth: width});
        return this;
    }

    public getWidth():number {
        return this._width;
    }

    public name(name:string):this {
        this._name = name;
        return this;
    }

    public getName():string {
        return this._name;
    }

    public titleFormatter(title:any):this {
        this._titleFormatter = title;
        return this;
    }

    public getTitleFormatter():any {
        return this._titleFormatter;
    }

    public getTitle():string {
        return this._titleFormatter(this);
    }

    public renderable(renderable:boolean):this {
        this._renderable = renderable;
        return this;
    }

    public getRenderable():boolean {
        return this._renderable;
    }

    public editable(editable:boolean = true):this {
        this._editable = editable;
        return this;
    }

    public getEditable():boolean {
        return this._editable;
    }

    public sortable(sortable:boolean = true):this {
        this._sortable = sortable;
        return this;
    }

    public getSortable():boolean {
        return this._sortable;
    }

    public editOnInput(editOnInput:boolean = true):this {
        this._editOnInput = editOnInput;
        return this;
    }

    public getEditOnInput():boolean {
        return this._editOnInput
    }

    public getHeaderType():HeaderCellInterface {
        return HeaderCell;
    }

    public editor(editor:any):this {

        this._editor = editor;
        return this;
    }

    public getEditor():any {

        return this._editor;
    }

    public allowClear(allowClear:boolean = true):this {
        this._allowClear = allowClear;
        return this;
    }

    public getAllowClear() {
        return this._allowClear;
    }

    public onClear(onClear:any):this {
        this._onClear = onClear;
        return this;
    }

    public getOnClear():any {
        return this._onClear;
    }

    public cellType(cellType:CellInterface):this {
        this._cellType = cellType;
        return this;
    }

    public getCellType():CellInterface {
        return this._cellType;
    }

    public setter(setter:any):this {
        this._setter = setter;
        return this;
    }

    public getSetter() {
        return this._setter;
    }

    public getter(getter:any):this {
        this._getter = getter;
        return this;
    }

    public getGetter() {
        return this._getter;
    }

    public parser(parser:any):this {
        this._parser = parser;
        return this;
    }

    public getParser():any {
        return this._parser;
    }

    public formatter(formatter:any):this {
        this._formatter = formatter;
        return this;
    }

    public getFormatter() {
        return this._formatter;
    }
}
