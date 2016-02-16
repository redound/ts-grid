module TSGrid {

    export class Column {

        protected _grid: Grid;

        protected _name: string;

        protected _label: string;

        protected _renderable: boolean = true;

        protected _editable: boolean = false;

        protected _cell: string;

        protected _formatter: string;

        public setGrid(grid: Grid) {
            this._grid = grid;
        }

        public getGrid(): Grid {
            return this._grid;
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

        public cell(cell: string): Column {
            this._cell = cell;
            return this;
        }

        public getCell(): string {
            return this._cell;
        }

        public getCellClass(): ICell {
            return TSGrid.resolveNameToClass<ICell>(this._cell + '-cell');
        }

        public getHeaderCellClass(): ICell {
            return TSGrid.resolveNameToClass<ICell>('header-cell');
        }

        public formatter(formatter: string): Column {
            this._formatter = formatter;
            return this;
        }

        public getFormatter() {
            return this._formatter;
        }

        public getFormatterClass() {
            return TSGrid.resolveNameToClass('string-formatter');
        }
    }
}
