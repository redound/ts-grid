/// <reference path="../../ts-core/build/ts-core.d.ts" />
declare module TSGrid {
    class Events {
        listenTo(target: any, eventName: string, handler: any): void;
        trigger(eventName: string, context: any): void;
    }
}
declare module TSGrid {
    class View extends Events {
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
        new (column: Column, model: TSCore.Data.Model, editor?: ICellEditor, formatter?: CellFormatter): Cell;
    }
    interface CellOptions {
        column?: Column;
    }
    class Cell extends View {
        tagName: string;
        formatter: CellFormatter;
        editor: ICellEditor;
        currentEditor: CellEditor;
        viewEvents: {
            "click": string;
        };
        column: Column;
        model: TSCore.Data.Model;
        constructor(column: Column, model: TSCore.Data.Model, editor?: ICellEditor, formatter?: ICellFormatter);
        initialize(): void;
        render(): Cell;
        enterEditMode(): void;
        renderError(model: TSCore.Data.Model, column: Column): void;
        exitEditMode(): void;
        remove(): Cell;
    }
}
declare module TSGrid {
    interface ICellEditor {
        new (column: Column, model: TSCore.Data.Model, formatter: CellFormatter): CellEditor;
    }
    class CellEditor extends View {
        column: Column;
        model: TSCore.Data.Model;
        formatter: CellFormatter;
        editScope: any;
        constructor(column: Column, model: TSCore.Data.Model, formatter: CellFormatter);
        initialize(): void;
        saveOrCancel(e: any, command?: Command): void;
        compile($el: JQuery): any;
        postRender(evt: any): CellEditor;
        destroyScope(): void;
        remove(): CellEditor;
        activate(): void;
    }
}
declare module TSGrid {
    interface ICellFormatter {
        new (): CellFormatter;
    }
    class CellFormatter extends TSCore.BaseObject {
        fromRaw(rawData: any, model: any): any;
        toRaw(formattedData: any, model: any): any;
    }
}
declare module TSGrid {
    class Column {
        protected _grid: Grid;
        protected _name: string;
        protected _label: string;
        protected _renderable: boolean;
        protected _editable: boolean;
        protected _cell: string;
        protected _formatter: string;
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
        cell(cell: string): Column;
        getCell(): string;
        getCellClass(): ICell;
        getHeaderCellClass(): ICell;
        formatter(formatter: string): Column;
        getFormatter(): string;
        getFormatterClass(): {};
    }
}
declare module TSGrid {
    enum CommandTypes {
        NONE = 0,
        MOVE_UP = 1,
        MOVE_DOWN = 2,
        MOVE_LEFT = 3,
        MOVE_RIGHT = 4,
        SAVE = 5,
        CANCEL = 6,
    }
}
declare module TSGrid {
    class Command {
        commandType: CommandTypes;
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
        blurred(): boolean;
        submitted(): boolean;
        clicked(): boolean;
        moveUp(): boolean;
        moveDown(): boolean;
        moveLeft(): boolean;
        moveRight(): boolean;
        save(): boolean;
        cancel(): boolean;
        passThru(): boolean;
        static fromEvent(evt: any): Command;
        static fromType(type: CommandTypes): Command;
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
        insertColumn(): void;
        removeColumn(): void;
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
        constructor(column: Column, model: TSCore.Data.Model, formatter: CellFormatter);
        initialize(): void;
        render(): InputCellEditor;
    }
}
declare module TSGrid {
    class NumberCell extends Cell {
        className: string;
        decimals: number;
        decimalSeparator: string;
        orderSeparator: string;
        formatter: CellFormatter;
        constructor(column: Column, model: TSCore.Data.Model, editor?: ICellEditor, formatter?: ICellFormatter);
        initialize(): void;
    }
}
declare module TSGrid {
    class IntegerCell extends NumberCell {
        className: string;
        decimals: number;
    }
}
declare module TSGrid {
    interface NumberFormatterOptions {
        decimals?: number;
        decimalSeparator?: string;
        orderSeparator?: string;
    }
    class NumberFormatter extends CellFormatter {
        static HUMANIZED_NUM_RE: RegExp;
        static defaults: {
            decimals: number;
            decimalSeparator: string;
            orderSeparator: string;
        };
        decimals: number;
        decimalSeparator: string;
        orderSeparator: string;
        constructor(options: NumberFormatterOptions);
        fromRaw(number: number, model: TSCore.Data.Model): string;
        toRaw(formattedData: any, model: any): string;
    }
}
declare module TSGrid {
    class StringCell extends Cell {
        className: string;
        formatter: CellFormatter;
    }
}
declare module TSGrid {
    class StringFormatter extends CellFormatter {
        fromRaw(rawValue: string, model: TSCore.Data.Model): string;
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
    }
}
declare module TSGrid {
    class TextCell extends Cell {
        className: string;
        editor: ICellEditor;
        formatter: CellFormatter;
    }
}
declare module TSGrid {
    class TextCellEditor extends CellEditor {
        tagName: string;
        viewEvents: any;
        constructor(column: Column, model: TSCore.Data.Model, formatter: CellFormatter);
        render(): TextCellEditor;
    }
}
