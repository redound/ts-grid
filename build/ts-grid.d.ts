/// <reference path="../../ts-core/build/ts-core.d.ts" />
declare module TSGrid {
    class View {
        static DELEGATE_EVENT_SPLITTER: RegExp;
        tagName: string;
        className: string;
        attributes: any;
        $el: JQuery;
        el: HTMLElement;
        id: number;
        cid: string;
        constructor();
        $(selector: any): JQuery;
        initialize(): void;
        render(): View;
        remove(): View;
        private _removeElement();
        setElement(element: JQuery | HTMLElement): View;
        protected _setElement(el: JQuery | HTMLElement): void;
        delegateEvents(events?: any): View;
        delegate(eventName: string, selector: string, listener: any): View;
        undelegateEvents(): View;
        undelegate(eventName: string, selector: string, listener: any): View;
        protected _createElement(tagName: string): HTMLElement;
        protected _ensureElement(): void;
        protected _setAttributes(attributes: any): void;
    }
}
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
    }
}
declare module TSGrid {
    class GridPosition {
        rowIndex: number;
        columnIndex: number;
        constructor(rowIndex: number, columnIndex: number);
        maxRowIndex(max: number): void;
        maxColumnIndex(max: number): void;
        same(gridPosition: GridPosition): boolean;
    }
}
declare module TSGrid {
    class Body extends View {
        tagName: string;
        className: string;
        columns: TSCore.Data.List<Column>;
        row: IRow;
        rows: TSCore.Data.List<Row>;
        items: TSCore.Data.List<TSCore.Data.Model>;
        _grid: Grid;
        constructor(columns: TSCore.Data.List<Column>, items: TSCore.Data.List<TSCore.Data.Model>, rowClass?: IRow);
        initialize(): void;
        setGrid(grid: Grid): void;
        getGrid(): Grid;
        insertRow(model: TSCore.Data.Model, index?: number, items?: TSCore.Data.List<TSCore.Data.Model>): void;
        insertRows(evt: any): void;
        removeRows(evt: any): void;
        removeRow(model: TSCore.Data.Model): Body;
        refresh(): void;
        render(): Body;
        remove(): View;
        moveToNextCell(evt: any): Body;
        reset(): void;
    }
}
declare module TSGrid {
    interface ICell {
        new (column: Column, model: TSCore.Data.Model): Cell;
    }
    class Cell extends View {
        tagName: string;
        editModeActive: boolean;
        focussed: boolean;
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
        processKeypress(evt: any): void;
        processKeydown(evt: any): void;
        click(): void;
        focus(): void;
        blur(): void;
        clear(): void;
        doneEditing(evt: any): void;
        enterEditMode(selectAll?: boolean, initialValue?: any): void;
        renderError(model: TSCore.Data.Model, column: Column): void;
        exitEditMode(): void;
        remove(): Cell;
    }
}
declare module TSGrid {
    interface ICellEditor {
        new (column: Column, model: TSCore.Data.Model): CellEditor;
    }
    class CellEditor extends View {
        column: Column;
        model: TSCore.Data.Model;
        scope: TSCore.Data.Dictionary<string, any>;
        $scope: any;
        value: any;
        constructor(column: Column, model: TSCore.Data.Model);
        initialize(): void;
        setValue(value: any): void;
        scopeValue(key: string, value: any): CellEditor;
        saveOrCancel(evt: any, command?: Command): void;
        compile($el: JQuery): any;
        postRender(evt: any): CellEditor;
        destroyScope(): void;
        remove(): CellEditor;
    }
}
declare module TSGrid {
    class Column {
        protected _uniqId: number;
        protected _grid: Grid;
        protected _name: string;
        protected _label: string;
        protected _renderable: boolean;
        protected _editable: boolean;
        protected _editor: any;
        protected _formatter: any;
        constructor();
        getId(): number;
        setGrid(grid: Grid): void;
        getGrid(): Grid;
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
        formatter(formatter: any): Column;
        getFormatter(): any;
    }
}
declare module TSGrid {
    interface IRow {
        new (columns: TSCore.Data.List<Column>, model: TSCore.Data.Model): Row;
    }
    class Row extends View {
        tagName: string;
        columns: TSCore.Data.List<Column>;
        model: TSCore.Data.Model;
        cells: TSCore.Data.List<Cell>;
        constructor(columns: TSCore.Data.List<Column>, model: TSCore.Data.Model);
        initialize(): void;
        makeCell(column: Column): Cell;
        render(): Row;
        reset(): void;
    }
}
declare module TSGrid {
    class FocusableRow extends Row {
        highlightColor: string;
        removeHighlightTimeout: any;
        viewEvents: any;
        rowFocused(): void;
        rowLostFocus(): void;
    }
}
declare module TSGrid {
    class Grid extends View {
        tagName: string;
        className: string;
        protected _header: Header;
        protected _body: Body;
        protected _columns: TSCore.Data.List<Column>;
        events: TSCore.Events.EventEmitter;
        constructor(header: Header, body: Body, columns: TSCore.Data.List<Column>);
        initialize(): void;
        setHeader(header: Header): void;
        getHeader(): Header;
        setBody(body: Body): void;
        getBody(): Body;
        setColumns(columns: TSCore.Data.List<Column>): void;
        getColumns(): TSCore.Data.List<Column>;
        insertRow(): Grid;
        removeRow(): Grid;
        render(): Grid;
        remove(): View;
    }
}
declare module TSGrid {
    class Header extends View {
        tagName: string;
        className: string;
        columns: TSCore.Data.List<Column>;
        row: HeaderRow;
        _grid: Grid;
        constructor(columns: TSCore.Data.List<Column>);
        initialize(): void;
        setGrid(grid: Grid): void;
        getGrid(): Grid;
        render(): Header;
        reset(): void;
    }
}
declare module TSGrid {
    class HeaderCell extends View {
        tagName: string;
        viewEvents: any;
        row: HeaderRow;
        column: Column;
        constructor(column: Column);
        initialize(): void;
        render(): HeaderCell;
    }
}
declare module TSGrid {
    class HeaderRow extends Row {
        makeCell(column: Column): Cell;
    }
}
declare module TSGrid {
    class InputCellEditor extends CellEditor {
        tagName: string;
        attributes: any;
        viewEvents: any;
        constructor(column: Column, model: TSCore.Data.Model);
        initialize(): void;
        render(): InputCellEditor;
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
declare module TSGrid {
    class TextCellEditor extends CellEditor {
        tagName: string;
        viewEvents: any;
        constructor(column: Column, model: TSCore.Data.Model);
        initialize(): void;
        render(): TextCellEditor;
    }
}
declare module TSGrid {
    class TypeaheadCellEditor extends CellEditor {
        tagName: string;
        attributes: any;
        viewEvents: any;
        constructor(column: Column, model: TSCore.Data.Model);
        initialize(): void;
        saveOrCancel(evt: any): void;
        openTypehead(): void;
        typeaheadOpened(): any;
        onSelect($item: any, $model: any, $label: any, $event: any): void;
        render(): TypeaheadCellEditor;
    }
}
