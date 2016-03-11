///<reference path="Cell.ts"/>

module TSGrid {

    export class Column {

        protected _uniqId: number;

        protected _grid: Grid;

        protected _width: number;

        protected _name: string;

        protected _label: string;

        protected _renderable: boolean = true;

        protected _editOnInput: boolean = false;

        protected _editable: boolean = false;

        protected _sortable: boolean = false;

        protected _editor: any;

        protected _onClear : any;

        protected _allowClear: boolean = false;

        protected _setter: any;

        protected _getter: any;

        protected _parser: any;

        protected _formatter: any;

        protected _cellType: ICell = Cell;

        protected _className: string;

        public constructor() {

            this._uniqId = parseInt(<any>_.uniqueId());
        }

        public className(className: string): this {
            this._className = className;
            return this;
        }

        public getClassName(): string {
            return this._className;
        }

        public getId() {
            return this._uniqId;
        }

        public setGrid(grid: Grid) {
            this._grid = grid;
        }

        public getGrid(): Grid {
            return this._grid;
        }

        public width(width: number): this {
            this._width = width;
            return this;
        }

        public getWidth(): number {
            return this._width;
        }

        public name(name: string): this {
            this._name = name;
            return this;
        }

        public getName(): string {
            return this._name;
        }

        public label(label: string): this {
            this._label = label;
            return this;
        }

        public getLabel(): string {
            return this._label;
        }

        public renderable(renderable: boolean): this {
            this._renderable = renderable;
            return this;
        }

        public getRenderable(): boolean {
            return this._renderable;
        }

        public editable(editable: boolean = true): this {
            this._editable = editable;
            return this;
        }

        public getEditable(): boolean {
            return this._editable;
        }

        public sortable(sortable: boolean = true): this {
            this._sortable = sortable;
            return this;
        }

        public getSortable(): boolean {
            return this._sortable;
        }

        public editOnInput(editOnInput: boolean = true): this {
            this._editOnInput = editOnInput;
            return this;
        }

        public getEditOnInput(): boolean {
            return this._editOnInput
        }

        public getHeaderType() {
            return TSGrid.resolveNameToClass<any>('header-cell');
        }

        public editor(editor: any): this {

            this._editor = editor;
            return this;
        }

        public getEditor(): any {

            return this._editor;
        }

        public allowClear(allowClear: boolean = true): this {
            this._allowClear = allowClear;
            return this;
        }

        public getAllowClear() {
            return this._allowClear;
        }

        public onClear(onClear: any): this {
            this._onClear = onClear;
            return this;
        }

        public getOnClear(): any {
            return this._onClear;
        }

        public cellType(cellType: ICell): this {
            this._cellType = cellType;
            return this;
        }

        public getCellType(): ICell {
            return this._cellType;
        }

        public setter(setter: any): this {
            this._setter = setter;
            return this;
        }

        public getSetter() {
            return this._setter;
        }

        public getter(getter: any): this {
            this._getter = getter;
            return this;
        }

        public getGetter() {
            return this._getter;
        }

        public parser(parser: any): this {
            this._parser = parser;
            return this;
        }

        public getParser(): any {
            return this._parser;
        }

        public formatter(formatter: any): this {
            this._formatter = formatter;
            return this;
        }

        public getFormatter() {
            return this._formatter;
        }
    }
}
