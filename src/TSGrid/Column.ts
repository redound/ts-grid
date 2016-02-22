///<reference path="Cell.ts"/>

module TSGrid {

    export class Column {

        protected _uniqId: number;

        protected _grid: Grid;

        protected _width: number;

        protected _name: string;

        protected _label: string;

        protected _renderable: boolean = true;

        protected _editable: boolean = false;

        protected _editor: any;

        protected _formatter: any;

        protected _cellType: ICell = Cell;

        protected _className: string;

        public constructor() {
            this._uniqId = parseInt(<any>_.uniqueId());
        }

        public className(className: string): Column {
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

        public width(width: number): Column {
            this._width = width;
            return this;
        }

        public getWidth(): number {
            return this._width;
        }

        public name(name: string): Column {
            this._name = name;
            return this;
        }

        public getName(): string {
            return this._name;
        }

        public label(label: string): Column {
            this._label = label;
            return this;
        }

        public getLabel(): string {
            return this._label;
        }

        public renderable(renderable: boolean): Column {
            this._renderable = renderable;
            return this;
        }

        public getRenderable(): boolean {
            return this._renderable;
        }

        public editable(editable: boolean): Column {
            this._editable = editable;
            return this;
        }

        public getEditable(): boolean {
            return this._editable;
        }

        public getHeaderType(): ICell {
            return TSGrid.resolveNameToClass<ICell>('header-cell');
        }

        public editor(editor: any): Column {

            this._editor = editor;
            return this;
        }

        public getEditor(): any {

            return this._editor;
        }

        public cellType(cellType: ICell): Column {
            this._cellType = cellType;
            return this;
        }

        public getCellType(): ICell {
            return this._cellType;
        }

        public formatter(formatter: any): Column {
            this._formatter = formatter;
            return this;
        }

        public getFormatter() {
            return this._formatter;
        }
    }
}
