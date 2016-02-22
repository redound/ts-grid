/// <reference path="../../ts-core/build/ts-core.d.ts" />
/// <reference path="../../ts-core-app/build/ts-core-app.d.ts" />
declare module TSGrid {
    enum CommandTypes {
        NONE = 0,
        ARROW_UP = 1,
        ARROW_DOWN = 2,
        ARROW_LEFT = 3,
        ARROW_RIGHT = 4,
        TAB = 5,
        SHIFT_TAB = 6,
        ENTER = 7,
        BACKSPACE = 8,
        SAVE = 9,
        CANCEL = 10,
    }
}
declare module TSGrid {
    class Command {
        static ALLOWED_INPUT: number[];
        commandType: CommandTypes;
        event: any;
        type: any;
        altKey: any;
        char: any;
        charCode: any;
        ctrlKey: boolean;
        key: string;
        keyCode: number;
        local: string;
        location: string;
        metaKey: boolean;
        repeat: boolean;
        shiftKey: boolean;
        which: number;
        setType(type: CommandTypes): void;
        setEvent(evt: any): void;
        getEvent(): any;
        blurred(): boolean;
        submitted(): boolean;
        clicked(): boolean;
        arrowUp(): boolean;
        arrowDown(): boolean;
        arrowLeft(): boolean;
        arrowRight(): boolean;
        shiftTab(): boolean;
        tab(): boolean;
        moveUp(): boolean;
        moveDown(): boolean;
        moveLeft(): boolean;
        moveRight(): boolean;
        enter(): boolean;
        backspace(): boolean;
        cancel(): boolean;
        navigate(): boolean;
        navigateWhileEdit(): boolean;
        input(): boolean;
        passThru(): boolean;
        static fromEvent(evt: any): Command;
        static fromType(type: CommandTypes): Command;
        static fromAction(action: CellEditorAction): Command;
    }
}
declare module TSGrid {
    class Body extends TSCore.App.UI.View {
        tagName: string;
        className: string;
        columns: TSCore.Data.List<Column>;
        rowType: IRow;
        rows: TSCore.Data.SortedList<Row>;
        collection: TSCore.Data.ModelCollection<TSCore.Data.Model>;
        _grid: Grid;
        constructor(columns: TSCore.Data.List<Column>, collection: TSCore.Data.ModelCollection<TSCore.Data.Model>, rowType?: IRow);
        initialize(): void;
        setGrid(grid: Grid): void;
        getGrid(): Grid;
        insertRow(model: TSCore.Data.Model, index?: number, items?: TSCore.Data.ModelCollection<TSCore.Data.Model>): void;
        insertRows(evt: any): void;
        removeRows(evt: any): void;
        removeRow(model: TSCore.Data.Model): Body;
        render(): Body;
        remove(): TSCore.App.UI.View;
        moveToNextCell(evt: any): Body;
    }
}
declare module TSGrid {
    interface ICell {
        new (column: Column, model: TSCore.Data.Model): Cell;
    }
    class Cell extends TSCore.App.UI.View {
        tagName: string;
        editModeActive: boolean;
        currentEditor: CellEditor;
        viewEvents: {
            "click": string;
            "blur": string;
            "keypress": string;
            "keydown": string;
        };
        column: Column;
        model: TSCore.Data.Model;
        constructor(column: Column, model: TSCore.Data.Model);
        initialize(): void;
        render(): Cell;
        protected keypress(evt: any): void;
        protected keydown(evt: any): void;
        protected click(): void;
        protected blur(): void;
        activate(): void;
        deactivate(): void;
        clear(): void;
        doneEditing(evt: any): void;
        enterEditMode(withModelValue?: any): void;
        renderError(model: TSCore.Data.Model, column: Column): void;
        exitEditMode(): void;
        remove(): Cell;
    }
}
declare module TSGrid {
    interface ICellEditor {
        new (column: Column, model: TSCore.Data.Model): CellEditor;
    }
    enum CellEditorAction {
        ESC = 0,
        BLUR = 1,
        ENTER = 2,
    }
    class CellEditor extends TSCore.App.UI.View {
        protected column: Column;
        protected model: TSCore.Data.Model;
        protected editorName: string;
        protected initialModelValue: any;
        constructor(column: Column, model: TSCore.Data.Model, editorName: string);
        setColumn(column: Column): CellEditor;
        getColumn(): Column;
        setModel(model: TSCore.Data.Model): CellEditor;
        getModel(): TSCore.Data.Model;
        setEditorName(editorName: string): CellEditor;
        getEditorName(): string;
        setInitialModelValue(value: any): CellEditor;
        getInitialModelValue(): any;
        setModelValue(value: any): CellEditor;
        getModelValue(): any;
        save(action: CellEditorAction, value: any): void;
        cancel(action: CellEditorAction): void;
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
        protected _editable: boolean;
        protected _editor: any;
        protected _formatter: any;
        protected _cellType: ICell;
        protected _className: string;
        constructor();
        className(className: string): Column;
        getClassName(): string;
        getId(): number;
        setGrid(grid: Grid): void;
        getGrid(): Grid;
        width(width: number): Column;
        getWidth(): number;
        name(name: string): Column;
        getName(): string;
        label(label: string): Column;
        getLabel(): string;
        renderable(renderable: boolean): Column;
        getRenderable(): boolean;
        editable(editable: boolean): Column;
        getEditable(): boolean;
        getHeaderType(): ICell;
        editor(editor: any): Column;
        getEditor(): any;
        cellType(cellType: ICell): Column;
        getCellType(): ICell;
        formatter(formatter: any): Column;
        getFormatter(): any;
    }
}
declare module TSGrid {
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
        setHeader(header: Header): void;
        getHeader(): Header;
        setBody(body: Body): void;
        getBody(): Body;
        setColumns(columns: TSCore.Data.List<Column>): void;
        getColumns(): TSCore.Data.List<Column>;
        getInnerWidth(): number;
        getWidth(): number;
        insertRow(): Grid;
        removeRow(): Grid;
        render(): Grid;
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
        setGrid(grid: Grid): Header;
        getGrid(): Grid;
        render(): Header;
    }
}
declare module TSGrid {
    class HeaderCell extends TSCore.App.UI.View {
        tagName: string;
        viewEvents: any;
        row: HeaderRow;
        column: Column;
        constructor(column: Column);
        initialize(): void;
        click(): void;
        render(): HeaderCell;
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
        setModel(model: TSCore.Data.Model): Row;
        makeCell(column: Column): Cell;
        render(): Row;
        reset(): void;
    }
}
declare module TSGrid {
    class HeaderRow extends Row {
        makeCell(column: Column): Cell;
    }
}
declare module TSGrid {
    var Extension: {};
    function resolveNameToClass<T>(name: any, suffix?: string): T;
    function callByNeed(...arg: any[]): any;
    module TSGridEvents {
        const RENDERED: string;
        const SORT: string;
        const EDIT: string;
        const EDITING: string;
        const EDITED: string;
        const ERROR: string;
        const NEXT: string;
        const NAVIGATE: string;
    }
}
