/// <reference path="../../ts-core/build/ts-core.d.ts" />
/// <reference path="../../ts-core-app/build/ts-core-app.d.ts" />
declare module TSGrid {
    enum CommandTypes {
        NONE = 0,
        UP = 1,
        DOWN = 2,
        LEFT = 3,
        RIGHT = 4,
        TAB = 5,
        SHIFT_TAB = 6,
        ENTER = 7,
        BACKSPACE = 8,
        BLUR = 9,
        ESC = 10,
    }
}
declare module TSGrid {
    class Command {
        protected _type: CommandTypes;
        type(type: CommandTypes): void;
        fromEvent(evt: any): void;
        blur(): boolean;
        up(): boolean;
        down(): boolean;
        left(): boolean;
        right(): boolean;
        shiftTab(): boolean;
        tab(): boolean;
        enter(): boolean;
        backspace(): boolean;
        esc(): boolean;
        static fromEvent(evt: any): Command;
        static fromType(type: CommandTypes): Command;
    }
}
declare module TSGrid {
    interface GridPosition {
        model: TSCore.Data.Model;
        column: TSGrid.Column;
    }
    class Body extends TSCore.App.UI.View {
        tagName: string;
        className: string;
        activePosition: GridPosition;
        activeCell: Cell;
        columns: TSCore.Data.List<Column>;
        rowType: IRow;
        rows: TSCore.Data.List<Row>;
        models: TSCore.Data.SortedList<TSCore.Data.Model>;
        collection: TSCore.Data.ModelCollection<TSCore.Data.Model>;
        _grid: Grid;
        constructor(columns: TSCore.Data.List<Column>, collection: TSCore.Data.ModelCollection<TSCore.Data.Model>, rowType?: IRow);
        initialize(): void;
        protected addModels(evt: any): void;
        protected removeModels(evt: any): void;
        setGrid(grid: Grid): void;
        getGrid(): Grid;
        insertRow(model: TSCore.Data.Model, index?: number, items?: TSCore.Data.ModelCollection<TSCore.Data.Model>): void;
        insertRows(evt: any): void;
        removeRows(evt: any): void;
        removeRow(model: TSCore.Data.Model): this;
        refresh(evt: any): void;
        render(): this;
        remove(): TSCore.App.UI.View;
        getActiveCell(): Cell;
        getCell(model: TSCore.Data.Model, column: TSGrid.Column): TSGrid.Cell;
        moveToCell(evt: any): void;
        protected activateCell(cell: TSGrid.Cell): void;
        moveToNextCell(evt: any): this;
    }
}
declare module TSGrid {
    interface ICell {
        new (column: Column, model: TSCore.Data.Model): Cell;
    }
    class Cell extends TSCore.App.UI.View {
        static CELL_INPUT: number[];
        tagName: string;
        editModeActive: boolean;
        currentEditor: CellEditor;
        viewEvents: {
            "click": string;
            "keypress": string;
            "keydown": string;
        };
        events: TSCore.Events.EventEmitter;
        column: Column;
        model: TSCore.Data.Model;
        activated: boolean;
        constructor(column: Column, model: TSCore.Data.Model);
        initialize(): void;
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
        renderError(model: TSCore.Data.Model, column: Column): void;
        exitEditMode(): void;
        remove(): this;
    }
}
declare module TSGrid {
    interface ICellEditor {
        new (column: Column, model: TSCore.Data.Model): CellEditor;
    }
    class CellEditor extends TSCore.App.UI.View {
        protected column: Column;
        protected model: TSCore.Data.Model;
        protected editorName: string;
        protected initialModelValue: any;
        constructor(column: Column, model: TSCore.Data.Model, editorName: string);
        setColumn(column: Column): this;
        getColumn(): Column;
        setModel(model: TSCore.Data.Model): this;
        getModel(): TSCore.Data.Model;
        setEditorName(editorName: string): this;
        getEditorName(): string;
        setInitialModelValue(value: any): this;
        getInitialModelValue(): any;
        setModelValue(value: any): this;
        getModelValue(): any;
        save(cmd: Command, value: any): void;
        cancel(cmd: Command): void;
    }
}
declare module TSGrid {
    class Column {
        protected _uniqId: number;
        protected _grid: Grid;
        protected _width: number;
        protected _name: string;
        protected _label: string;
        protected _renderable: boolean;
        protected _editOnInput: boolean;
        protected _editable: boolean;
        protected _sortable: boolean;
        protected _editor: any;
        protected _onClear: any;
        protected _allowClear: boolean;
        protected _setter: any;
        protected _getter: any;
        protected _parser: any;
        protected _formatter: any;
        protected _cellType: ICell;
        protected _className: string;
        constructor();
        className(className: string): this;
        getClassName(): string;
        getId(): number;
        setGrid(grid: Grid): void;
        getGrid(): Grid;
        width(width: number): this;
        getWidth(): number;
        name(name: string): this;
        getName(): string;
        label(label: string): this;
        getLabel(): string;
        renderable(renderable: boolean): this;
        getRenderable(): boolean;
        editable(editable?: boolean): this;
        getEditable(): boolean;
        sortable(sortable?: boolean): this;
        getSortable(): boolean;
        editOnInput(editOnInput?: boolean): this;
        getEditOnInput(): boolean;
        getHeaderType(): any;
        editor(editor: any): this;
        getEditor(): any;
        allowClear(allowClear?: boolean): this;
        getAllowClear(): boolean;
        onClear(onClear: any): this;
        getOnClear(): any;
        cellType(cellType: ICell): this;
        getCellType(): ICell;
        setter(setter: any): this;
        getSetter(): any;
        getter(getter: any): this;
        getGetter(): any;
        parser(parser: any): this;
        getParser(): any;
        formatter(formatter: any): this;
        getFormatter(): any;
    }
}
declare module TSGrid {
    import SortedListDirection = TSCore.Data.SortedListDirection;
    class Grid extends TSCore.App.UI.View {
        tagName: string;
        className: string;
        protected _header: Header;
        protected _body: Body;
        protected _columns: TSCore.Data.List<Column>;
        protected _width: number;
        events: TSCore.Events.EventEmitter;
        constructor(header: Header, body: Body, columns: TSCore.Data.List<Column>);
        initialize(): void;
        sort(sortPredicate: any, sortDirection: SortedListDirection): void;
        protected afterSort(sortPredicate: any, sortDirection: SortedListDirection): void;
        setHeader(header: Header): this;
        getHeader(): Header;
        setBody(body: Body): this;
        getBody(): Body;
        setColumns(columns: TSCore.Data.List<Column>): this;
        getColumns(): TSCore.Data.List<Column>;
        getInnerWidth(): number;
        getWidth(): number;
        insertRow(): Grid;
        removeRow(): Grid;
        render(): this;
        protected listenHeaderCells(): void;
        protected headerCellOnClick(e: any): void;
        protected sortName(name: string): void;
        remove(): TSCore.App.UI.View;
    }
}
declare module TSGrid {
    class Header extends TSCore.App.UI.View {
        tagName: string;
        className: string;
        columns: TSCore.Data.List<Column>;
        row: HeaderRow;
        _grid: Grid;
        constructor(columns: TSCore.Data.List<Column>);
        initialize(): void;
        setGrid(grid: Grid): this;
        getGrid(): Grid;
        render(): this;
    }
}
declare module TSGrid {
    class HeaderCell extends TSCore.App.UI.View {
        tagName: string;
        viewEvents: any;
        row: HeaderRow;
        column: Column;
        events: TSCore.Events.EventEmitter;
        protected sortDirection: TSCore.Data.SortedListDirection;
        constructor(column: Column, model: TSCore.Data.Model);
        click(): void;
        setSortDirection(direction: TSCore.Data.SortedListDirection): void;
        render(): this;
    }
}
declare module TSGrid {
    module HeaderCellEvents {
        const CLICK: string;
    }
}
declare module TSGrid {
    interface IRow {
        new (columns: TSCore.Data.List<Column>, model: TSCore.Data.Model): Row;
    }
    class Row extends TSCore.App.UI.View {
        tagName: string;
        columns: TSCore.Data.List<Column>;
        modelId: any;
        model: TSCore.Data.Model;
        cells: TSCore.Data.List<Cell>;
        constructor(columns: TSCore.Data.List<Column>, model: TSCore.Data.Model);
        initialize(): void;
        setModel(model: TSCore.Data.Model): this;
        makeCell(column: Column): Cell;
        render(): this;
        reset(): void;
    }
}
declare module TSGrid {
    class HeaderRow extends TSCore.App.UI.View {
        tagName: string;
        columns: TSCore.Data.List<Column>;
        cells: TSCore.Data.List<TSGrid.HeaderCell>;
        constructor(columns: TSCore.Data.List<Column>);
        initialize(): void;
        makeCell(column: Column): any;
        render(): this;
    }
}
declare module TSGrid {
    var Extension: {};
    function resolveNameToClass<T>(name: any, suffix?: string): T;
    function callByNeed(...arg: any[]): any;
    module TSGridEvents {
        const RENDERED: string;
        const REFRESH: string;
        const SORT: string;
        const EDIT: string;
        const EDITING: string;
        const EDITED: string;
        const ERROR: string;
        const NEXT: string;
        const NAVIGATE: string;
        const CLICK: string;
    }
}
