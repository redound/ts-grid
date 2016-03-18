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
        DELETE = 9,
        BLUR = 10,
        ESC = 11,
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
        delete(): boolean;
        esc(): boolean;
        static fromEvent(evt: any): Command;
        static fromType(type: CommandTypes): Command;
    }
}
declare module TSGrid {
    interface GridPosition {
        model: TSCore.App.Data.Model.ActiveModel;
        column: TSGrid.Column;
    }
    interface IBodyDelegate {
        bodyDefaultSortPredicateForModels(body: TSGrid.Body): any;
        bodyDefaultSortDirectionForModels(body: TSGrid.Body): TSCore.Data.SortedListDirection;
        bodyModelForEmptyRow(body: TSGrid.Body): TSCore.App.Data.Model.ActiveModel;
        bodyPrimaryKeyForModels(body: TSGrid.Body): any;
        bodyBeforeCreateModel(body: TSGrid.Body, model: TSCore.App.Data.Model.ActiveModel): void;
        bodyCreateModel(body: TSGrid.Body, model: TSCore.App.Data.Model.ActiveModel): ng.IPromise<TSCore.App.Data.Model.ActiveModel>;
        bodyAfterCreateModel(body: TSGrid.Body, model: TSCore.App.Data.Model.ActiveModel): void;
        bodyValidateModel(body: TSGrid.Body, model: TSCore.App.Data.Model.ActiveModel): boolean;
        bodyShouldUpdateModel(body: TSGrid.Body, model: TSCore.App.Data.Model.ActiveModel): boolean;
        bodyUpdateModel(body: TSGrid.Body, model: TSCore.App.Data.Model.ActiveModel): ng.IPromise<TSCore.App.Data.Model.ActiveModel>;
        bodyAfterUpdateModel(body: TSGrid.Body, model: TSCore.App.Data.Model.ActiveModel): void;
    }
    class Body extends TSCore.App.UI.View {
        tagName: string;
        className: string;
        activePosition: GridPosition;
        activeRow: Row;
        activeCell: Cell;
        columns: TSCore.Data.List<Column>;
        cols: TSCore.Data.List<JQuery>;
        rowType: IRow;
        rows: TSCore.Data.List<Row>;
        models: TSCore.Data.SortedList<TSCore.App.Data.Model.ActiveModel>;
        rowsByModelId: TSCore.Data.Dictionary<any, TSGrid.Row>;
        collection: TSCore.Data.ModelCollection<TSCore.App.Data.Model.ActiveModel>;
        emptyRow: Row;
        _grid: Grid;
        $table: JQuery;
        $tbody: JQuery;
        $colgroup: JQuery;
        protected _delegate: IBodyDelegate;
        events: TSCore.Events.EventEmitter;
        constructor(delegate: IBodyDelegate, columns: TSCore.Data.List<Column>, collection: TSCore.Data.ModelCollection<TSCore.App.Data.Model.ActiveModel>, rowType?: IRow);
        initialize(): void;
        protected columnChangedWidth(e: any): void;
        getDelegate(): IBodyDelegate;
        protected addModels(evt: any): void;
        protected removeModels(evt: any): void;
        setGrid(grid: Grid): void;
        getGrid(): Grid;
        protected prependEmptyRow(): void;
        protected removeEmptyRow(): void;
        protected emptyRowDidChange(e: any): void;
        addRow(model: TSCore.App.Data.Model.ActiveModel, index?: number, items?: TSCore.Data.ModelCollection<TSCore.App.Data.Model.ActiveModel>): void;
        protected insertRow(row: TSGrid.Row): void;
        addRows(evt: any): void;
        removeRows(evt: any): void;
        removeRow(model: TSCore.App.Data.Model.ActiveModel): this;
        sortRows(e: any): void;
        refresh(evt: any): void;
        render(): this;
        remove(): this;
        getActiveCell(): Cell;
        getCell(model: TSCore.App.Data.Model.ActiveModel, column: TSGrid.Column): TSGrid.Cell;
        moveToCell(evt: any): void;
        protected deactivateCell(): void;
        protected activate(row: TSGrid.Row, cell: TSGrid.Cell): void;
        protected changedRow(fromRow: TSGrid.Row, toRow: TSGrid.Row): void;
        protected focusEmptyRow(): void;
        protected changedCell(fromCell: TSGrid.Cell, toCell: TSGrid.Cell): void;
        moveToNextCell(evt: any): this;
        protected beforeActivateCell(column: TSGrid.Column, model: TSCore.App.Data.Model.ActiveModel): boolean;
    }
}
declare module TSGrid.BodyEvents {
    const CHANGED_ROW: string;
    const CHANGED_CELL: string;
}
declare module TSGrid {
    interface ICell {
        new (column: Column, model: TSCore.App.Data.Model.ActiveModel): Cell;
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
        model: TSCore.App.Data.Model.ActiveModel;
        activated: boolean;
        protected _validationEnabled: boolean;
        constructor(column: Column, model: TSCore.App.Data.Model.ActiveModel);
        initialize(): void;
        validationEnabled(validationEnabled?: boolean): this;
        getValidationEnabled(): boolean;
        setModelValue(value: any): this;
        getModelValue(): any;
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
        protected cellEditorOnSave(e: any): void;
        protected cellEditorOnCancel(e: any): void;
        exitEditMode(): void;
        remove(): this;
    }
}
declare module TSGrid {
    interface ICellEditor {
        new (column: Column, model: TSCore.App.Data.Model.ActiveModel): CellEditor;
    }
    class CellEditor extends TSCore.App.UI.View {
        protected column: Column;
        protected model: TSCore.App.Data.Model.ActiveModel;
        protected editorName: string;
        protected initialModelValue: any;
        events: TSCore.Events.EventEmitter;
        constructor(column: Column, model: TSCore.App.Data.Model.ActiveModel, editorName: string);
        setColumn(column: Column): this;
        getColumn(): Column;
        setModel(model: TSCore.App.Data.Model.ActiveModel): this;
        getModel(): TSCore.App.Data.Model.ActiveModel;
        setEditorName(editorName: string): this;
        getEditorName(): string;
        setInitialModelValue(value: any): this;
        getInitialModelValue(): any;
        getModelValue(): any;
        save(cmd: Command, value: any): void;
        cancel(cmd: Command): void;
    }
}
declare module TSGrid.CellEditorEvents {
    const SAVE: string;
    const CANCEL: string;
}
declare module TSGrid.CellEvents {
    const CHANGED: string;
    const CLEARED: string;
}
declare module TSGrid {
    class Column {
        protected _uniqId: number;
        protected _grid: Grid;
        protected _resizable: boolean;
        protected _minWidth: number;
        protected _maxWidth: number;
        protected _width: number;
        protected _name: string;
        protected _titleFormatter: any;
        protected _descriptionFormatter: any;
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
        events: TSCore.Events.EventEmitter;
        constructor();
        descriptionFormatter(descriptionFormatter: any): this;
        getDescriptionFormatter(): any;
        getDescription(): string;
        className(className: string): this;
        getClassName(): string;
        getId(): number;
        setGrid(grid: Grid): void;
        getGrid(): Grid;
        resizable(resizable?: boolean): this;
        getResizable(): boolean;
        minWidth(minWidth: number): this;
        getMinWidth(): number;
        maxWidth(maxWidth: number): this;
        getMaxWidth(): number;
        width(width: number): this;
        getWidth(): number;
        name(name: string): this;
        getName(): string;
        titleFormatter(title: any): this;
        getTitleFormatter(): any;
        getTitle(): string;
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
declare module TSGrid.ColumnEvents {
    const CHANGED_WIDTH: string;
}
declare module TSGrid {
    class ColumnResizer extends TSCore.App.UI.View {
        tagName: string;
        className: string;
        viewEvents: any;
        events: TSCore.Events.EventEmitter;
        protected _active: boolean;
        constructor();
        protected mousedown(): void;
        protected mouseup(): void;
        setActive(active: boolean): this;
        getActive(): boolean;
    }
}
declare module TSGrid {
    module ColumnResizerEvents {
        const MOUSEUP: string;
        const MOUSEDOWN: string;
    }
}
declare module TSGrid {
    class ColumnResizerGuide extends TSCore.App.UI.View {
        tagName: string;
        className: string;
        protected _active: boolean;
        constructor();
        setActive(active: boolean): this;
        getActive(): boolean;
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
        protected _columnResizer: ColumnResizer;
        protected _columnResizerGuide: ColumnResizerGuide;
        mousePageOffsetX: number;
        columnResizeStartOffsetX: number;
        protected _lastHeaderCell: TSGrid.HeaderCell;
        protected _resizeHeaderCell: TSGrid.HeaderCell;
        constructor(header: Header, body: Body, columns: TSCore.Data.List<Column>);
        initialize(): void;
        protected documentOnMouseLeave(e: any): void;
        protected resetColumnResizer(): void;
        protected documentOnMouseMove(e: any): void;
        protected positionColumnResizer(offsetX?: number): void;
        protected documentOnMouseUp(e: any): void;
        protected createColumnResizer(): void;
        protected columnResizerOnMouseDown(e: any): void;
        sort(sortPredicate: any, sortDirection: SortedListDirection): void;
        protected afterSort(sortPredicate: any, sortDirection: SortedListDirection): void;
        setHeader(header: Header): this;
        getHeader(): Header;
        setBody(body: Body): this;
        getBody(): Body;
        setColumns(columns: TSCore.Data.List<Column>): this;
        calculateWidth(): void;
        getColumns(): TSCore.Data.List<Column>;
        getInnerWidth(): number;
        getWidth(): number;
        render(): this;
        protected listenHeaderCells(): void;
        protected columnChangedWidth(e: any): void;
        protected headerCellOnClick(e: any): void;
        protected headerCellOnMouseEnter(e: any): void;
        protected headerCellOnMouseLeave(e: any): void;
        protected positionColumnResizerAtHeaderCell(headerCell: TSGrid.HeaderCell): void;
        protected sortName(name: string): void;
        remove(): this;
    }
}
declare module TSGrid {
    class Header extends TSCore.App.UI.View {
        tagName: string;
        className: string;
        viewEvents: any;
        columns: TSCore.Data.List<Column>;
        cols: TSCore.Data.List<JQuery>;
        row: HeaderRow;
        _grid: Grid;
        $table: JQuery;
        $colgroup: JQuery;
        constructor(columns: TSCore.Data.List<Column>);
        initialize(): void;
        protected columnChangedWidth(e: any): void;
        protected dragstart(e: any): void;
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
        constructor(column: Column, model: TSCore.App.Data.Model.ActiveModel);
        initialize(): void;
        protected columnChangedWidth(e: any): void;
        protected click(): void;
        protected mouseenter(): void;
        protected mouseleave(): void;
        setSortDirection(direction: TSCore.Data.SortedListDirection): void;
        render(): this;
    }
}
declare module TSGrid {
    module HeaderCellEvents {
        const CLICK: string;
        const MOUSEENTER: string;
        const MOUSELEAVE: string;
    }
}
declare module TSGrid {
    interface IRow {
        new (columns: TSCore.Data.List<Column>, model: TSCore.App.Data.Model.ActiveModel): Row;
    }
    class Row extends TSCore.App.UI.View {
        tagName: string;
        columns: TSCore.Data.List<Column>;
        modelId: any;
        model: TSCore.App.Data.Model.ActiveModel;
        cells: TSCore.Data.List<Cell>;
        events: TSCore.Events.EventEmitter;
        protected _active: any;
        protected _loading: any;
        valid: boolean;
        constructor(columns: TSCore.Data.List<Column>, model: TSCore.App.Data.Model.ActiveModel);
        initialize(): void;
        setLoading(loading: boolean): void;
        setActive(active: boolean): void;
        setModel(model: TSCore.App.Data.Model.ActiveModel): this;
        makeCell(column: Column): Cell;
        protected cellDidChange(e: any): void;
        protected cellDidClear(e: any): void;
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
declare module TSGrid.RowEvents {
    const CHANGED: string;
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
        const CHANGED_WIDTH: string;
        const CLICK: string;
    }
}
