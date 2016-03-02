var TSGrid;
(function (TSGrid) {
    (function (CommandTypes) {
        CommandTypes[CommandTypes["NONE"] = 0] = "NONE";
        CommandTypes[CommandTypes["ARROW_UP"] = 1] = "ARROW_UP";
        CommandTypes[CommandTypes["ARROW_DOWN"] = 2] = "ARROW_DOWN";
        CommandTypes[CommandTypes["ARROW_LEFT"] = 3] = "ARROW_LEFT";
        CommandTypes[CommandTypes["ARROW_RIGHT"] = 4] = "ARROW_RIGHT";
        CommandTypes[CommandTypes["TAB"] = 5] = "TAB";
        CommandTypes[CommandTypes["SHIFT_TAB"] = 6] = "SHIFT_TAB";
        CommandTypes[CommandTypes["ENTER"] = 7] = "ENTER";
        CommandTypes[CommandTypes["BACKSPACE"] = 8] = "BACKSPACE";
        CommandTypes[CommandTypes["SAVE"] = 9] = "SAVE";
        CommandTypes[CommandTypes["CANCEL"] = 10] = "CANCEL";
    })(TSGrid.CommandTypes || (TSGrid.CommandTypes = {}));
    var CommandTypes = TSGrid.CommandTypes;
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var Command = (function () {
        function Command() {
        }
        Command.prototype.setType = function (type) {
            this.commandType = type;
        };
        Command.prototype.setEvent = function (evt) {
            this.event = evt;
            this.type = evt.type;
            this.ctrlKey = !!evt.ctrlKey;
            this.keyCode = evt.keyCode;
            this.shiftKey = !!evt.shiftKey;
            switch (true) {
                case (this.keyCode === 38):
                    this.commandType = TSGrid.CommandTypes.ARROW_UP;
                    break;
                case (this.keyCode === 40):
                    this.commandType = TSGrid.CommandTypes.ARROW_DOWN;
                    break;
                case (this.shiftKey && this.keyCode === 9):
                    this.commandType = TSGrid.CommandTypes.SHIFT_TAB;
                    break;
                case (this.keyCode === 37):
                    this.commandType = TSGrid.CommandTypes.ARROW_LEFT;
                    break;
                case (!this.shiftKey && this.keyCode === 9):
                    this.commandType = TSGrid.CommandTypes.TAB;
                    break;
                case (this.keyCode === 39):
                    this.commandType = TSGrid.CommandTypes.ARROW_RIGHT;
                    break;
                case (!this.shiftKey && this.keyCode === 13):
                    this.commandType = TSGrid.CommandTypes.ENTER;
                    break;
                case (this.keyCode === 8):
                    this.commandType = TSGrid.CommandTypes.BACKSPACE;
                    break;
                case (this.keyCode === 27):
                    this.commandType = TSGrid.CommandTypes.CANCEL;
                    break;
                default:
                    this.commandType = TSGrid.CommandTypes.NONE;
                    break;
            }
        };
        Command.prototype.getEvent = function () {
            return this.event;
        };
        Command.prototype.blurred = function () {
            return this.type === "blur";
        };
        Command.prototype.submitted = function () {
            return this.type === "submit";
        };
        Command.prototype.clicked = function () {
            return this.type === "click";
        };
        Command.prototype.arrowUp = function () {
            return this.commandType === TSGrid.CommandTypes.ARROW_UP;
        };
        Command.prototype.arrowDown = function () {
            return this.commandType === TSGrid.CommandTypes.ARROW_DOWN;
        };
        Command.prototype.arrowLeft = function () {
            return this.commandType === TSGrid.CommandTypes.ARROW_LEFT;
        };
        Command.prototype.arrowRight = function () {
            return this.commandType === TSGrid.CommandTypes.ARROW_RIGHT;
        };
        Command.prototype.shiftTab = function () {
            return this.commandType === TSGrid.CommandTypes.SHIFT_TAB;
        };
        Command.prototype.tab = function () {
            return this.commandType === TSGrid.CommandTypes.TAB;
        };
        Command.prototype.moveUp = function () {
            return this.arrowUp();
        };
        Command.prototype.moveDown = function () {
            return this.arrowDown();
        };
        Command.prototype.moveLeft = function () {
            return (this.arrowLeft() || this.shiftTab());
        };
        Command.prototype.moveRight = function () {
            return (this.arrowRight() || this.tab());
        };
        Command.prototype.enter = function () {
            return this.commandType === TSGrid.CommandTypes.ENTER;
        };
        Command.prototype.backspace = function () {
            return this.commandType === TSGrid.CommandTypes.BACKSPACE;
        };
        Command.prototype.cancel = function () {
            return this.commandType === TSGrid.CommandTypes.CANCEL;
        };
        Command.prototype.navigate = function () {
            return (this.moveUp() || this.moveDown() || this.moveLeft() || this.moveRight());
        };
        Command.prototype.navigateWhileEdit = function () {
            return (this.navigate() && !this.arrowLeft() && !this.arrowRight());
        };
        Command.prototype.input = function () {
            return Command.ALLOWED_INPUT.indexOf(this.keyCode) !== -1;
        };
        Command.prototype.passThru = function () {
            return !(this.navigate() || this.enter() || this.cancel());
        };
        Command.fromEvent = function (evt) {
            var command = new Command();
            command.setEvent(evt);
            return command;
        };
        Command.fromType = function (type) {
            var command = new Command();
            command.setType(type);
            return command;
        };
        Command.fromAction = function (action) {
            var command = new Command();
            switch (action) {
                case TSGrid.CellEditorAction.BLUR:
                    command.setType(TSGrid.CommandTypes.CANCEL);
                    break;
                case TSGrid.CellEditorAction.ESC:
                    command.setType(TSGrid.CommandTypes.CANCEL);
                    break;
                case TSGrid.CellEditorAction.ENTER:
                    command.setType(TSGrid.CommandTypes.ENTER);
                    break;
                default:
                    break;
            }
            return command;
        };
        Command.ALLOWED_INPUT = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 167, 177, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 91, 92, 93, 94, 95, 96, 97, 98, 99, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90];
        return Command;
    })();
    TSGrid.Command = Command;
})(TSGrid || (TSGrid = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TSGrid;
(function (TSGrid) {
    var Body = (function (_super) {
        __extends(Body, _super);
        function Body(columns, collection, rowType) {
            _super.call(this);
            this.tagName = 'div';
            this.className = 'ts-grid-body';
            this.rowType = TSGrid.Row;
            this.columns = columns;
            this.collection = collection;
            this.rowType = rowType;
            this.initialize();
        }
        Body.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            this.rows = new TSCore.Data.SortedList([], function () { });
            this.collection.each(function (model) {
                _this.rows.add(new _this.rowType(_this.columns, model));
            });
            this.collection.events.on(TSCore.Data.CollectionEvents.ADD, function (evt) { return _this.insertRows(evt); });
            this.collection.events.on(TSCore.Data.CollectionEvents.REMOVE, function (evt) { return _this.removeRows(evt); });
        };
        Body.prototype.setGrid = function (grid) {
            this._grid = grid;
            grid.events.on(TSGrid.TSGridEvents.EDITED, this.moveToNextCell, this);
            grid.events.on(TSGrid.TSGridEvents.NAVIGATE, this.moveToNextCell, this);
        };
        Body.prototype.getGrid = function () {
            return this._grid;
        };
        Body.prototype.insertRow = function (model, index, items) {
            if (_.isUndefined(items)) {
                this.collection.add(model);
                return;
            }
            var row = new this.rowType(this.columns, model);
            this.rows.add(row);
            index = this.rows.indexOf(row);
            var $tbody = this.$el.find('tbody');
            var $children = $tbody.children();
            var $rowEl = row.render().$el;
            if (index >= $children.length) {
                $tbody.append($rowEl);
            }
            else {
                $children.eq(index).before($rowEl);
            }
        };
        Body.prototype.insertRows = function (evt) {
            var _this = this;
            var operations = evt.params.operations;
            console.log('insertRows', operations);
            _.each(operations, function (operation) {
                _this.insertRow(operation.item, operation.index, _this.collection);
            });
        };
        Body.prototype.removeRows = function (evt) {
            var _this = this;
            var operations = evt.params.operations;
            console.log('removeRows', operations);
            var rows = _.map(operations, function (operation) {
                return _this.rows.get(operation.index);
            });
            _.each(rows, function (row) {
                row.remove();
                _this.rows.remove(row);
            });
        };
        Body.prototype.removeRow = function (model) {
            this.collection.remove(model);
            return this;
        };
        Body.prototype.render = function () {
            var grid = this.getGrid();
            this.$el.empty();
            var $table = $('<table />');
            var $tbody = $('<tbody />');
            $table.append($tbody);
            this.rows.each(function (row) {
                $tbody.append(row.render().$el);
            });
            $table.attr('width', grid.getInnerWidth());
            this.$el.append($table);
            this.delegateEvents();
            return this;
        };
        Body.prototype.remove = function () {
            this.rows.each(function (row) {
                row.remove.apply(row, arguments);
            });
            return _super.prototype.remove.call(this);
        };
        Body.prototype.moveToNextCell = function (evt) {
            var grid = this.getGrid();
            var model = evt.params.model;
            var column = evt.params.column;
            var command = evt.params.command;
            var cell, renderable, editable, m, n;
            var row = this.rows.whereFirst({ modelId: model.id });
            var i = this.rows.indexOf(row);
            var j = this.columns.indexOf(column);
            if (j === -1)
                return this;
            var currentCell = this.rows.get(i).cells.get(j);
            if (command.navigate() || command.blurred()) {
                var l = this.columns.length;
                var maxOffset = l * this.collection.length;
                if (command.blurred()) {
                    currentCell.deactivate();
                }
                else if (command.moveUp() || command.moveDown()) {
                    m = i + (command.moveUp() ? -1 : 1);
                    var e = command.getEvent();
                    if (e) {
                        e.preventDefault();
                    }
                    var row = this.rows.get(m);
                    if (row) {
                        cell = row.cells.get(j);
                        if (TSGrid.callByNeed(cell.column.getEditable(), cell.column, model)) {
                            var editMode = currentCell.editModeActive;
                            currentCell.deactivate();
                            cell.activate();
                            if (editMode) {
                                cell.enterEditMode();
                            }
                            grid.events.trigger(TSGrid.TSGridEvents.NEXT, {
                                row: m,
                                column: j,
                                outside: false
                            });
                        }
                    }
                    else {
                        grid.events.trigger(TSGrid.TSGridEvents.NEXT, {
                            row: m,
                            column: j,
                            outside: true
                        });
                    }
                }
                else if (command.moveLeft() || command.moveRight()) {
                    var e = command.getEvent();
                    if (e) {
                        e.preventDefault();
                    }
                    var right = command.moveRight();
                    for (var offset = i * l + j + (right ? 1 : -1); offset >= 0 && offset < maxOffset; right ? offset++ : offset--) {
                        m = ~~(offset / l);
                        n = offset - m * l;
                        cell = this.rows.get(m).cells.get(n);
                        renderable = TSGrid.callByNeed(cell.column.getRenderable(), cell.column, cell.model);
                        editable = TSGrid.callByNeed(cell.column.getEditable(), cell.column, model);
                        if (renderable && editable) {
                            var editMode = currentCell.editModeActive;
                            currentCell.deactivate();
                            cell.activate();
                            if (editMode) {
                                cell.enterEditMode();
                            }
                            grid.events.trigger(TSGrid.TSGridEvents.NEXT, {
                                row: m,
                                column: n,
                                outside: false
                            });
                            break;
                        }
                    }
                    if (offset == maxOffset) {
                        grid.events.trigger(TSGrid.TSGridEvents.NEXT, {
                            row: ~~(offset / l),
                            column: offset - m * l,
                            outside: true
                        });
                    }
                }
            }
            return this;
        };
        return Body;
    })(TSCore.App.UI.View);
    TSGrid.Body = Body;
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var Cell = (function (_super) {
        __extends(Cell, _super);
        function Cell(column, model) {
            _super.call(this);
            this.tagName = 'td';
            this.editModeActive = false;
            this.viewEvents = {
                "click": "click",
                "focusout": "focusout",
                "focus": "focus",
                "blur": "blur",
                "keypress": "keypress",
                "keydown": "keydown"
            };
            this.column = column;
            this.model = model;
            this.initialize();
        }
        Cell.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.model.events.on(TSGrid.TSGridEvents.EDITED, this.doneEditing, this);
            if (TSGrid.callByNeed(this.column.getEditable(), this.column, this.model))
                this.$el.addClass("editable");
            if (TSGrid.callByNeed(this.column.getRenderable(), this.column, this.model))
                this.$el.addClass("renderable");
        };
        Cell.prototype.render = function () {
            this.$el.empty();
            var formatter = this.column.getFormatter();
            var modelValue = this.model.get(this.column.getName());
            var value = formatter ? formatter(this.model) : modelValue;
            this.$el.html(value);
            this.$el.attr('width', this.column.getWidth());
            this.$el.css('max-width', this.column.getWidth());
            var columnClassName = this.column.getClassName();
            if (columnClassName) {
                this.$el.addClass(columnClassName);
            }
            this.delegateEvents();
            return this;
        };
        Cell.prototype.keypress = function (evt) {
            var command = TSGrid.Command.fromEvent(evt);
            if (this.column.getEditOnInput() && command.input()) {
                var char = String.fromCharCode(evt.keyCode);
                this.enterEditMode(char);
            }
        };
        Cell.prototype.keydown = function (evt) {
            var command = TSGrid.Command.fromEvent(evt);
            if (command.enter()) {
                this.enterEditMode();
            }
            if (command.backspace()) {
                evt.preventDefault();
                if (this.column.getAllowNull()) {
                    this.clear();
                }
            }
            if (command.navigate()) {
                var grid = this.column.getGrid();
                grid.events.trigger(TSGrid.TSGridEvents.NAVIGATE, {
                    column: this.column,
                    model: this.model,
                    command: command
                });
            }
        };
        Cell.prototype.click = function () {
            if (this.$el.is(':focus')) {
                this.enterEditMode();
            }
            else {
                this.activate();
            }
        };
        Cell.prototype.blur = function () {
            this.$el.removeClass('active');
            this.$el.removeAttr('tabindex');
        };
        Cell.prototype.focusout = function () {
            if (this.editModeActive) {
                this.exitEditMode();
            }
        };
        Cell.prototype.activate = function () {
            this.$el.attr('tabindex', 0);
            this.$el.focus();
        };
        Cell.prototype.focus = function () {
            this.$el.addClass('active');
        };
        Cell.prototype.deactivate = function () {
            this.$el.blur();
        };
        Cell.prototype.clear = function () {
            this.model.set(this.column.getName(), null);
            this.render();
        };
        Cell.prototype.doneEditing = function (evt) {
            var column = evt.params.column;
            var command = evt.params.command;
            if ((command.enter() || command.submitted() || command.cancel()) && (column == null || column.getId() == this.column.getId())) {
                if (this.editModeActive) {
                    this.exitEditMode();
                }
                this.activate();
            }
        };
        Cell.prototype.enterEditMode = function (withModelValue) {
            var _this = this;
            if (this.editModeActive)
                return;
            var editable = TSGrid.callByNeed(this.column.getEditable(), this.column, this.model);
            if (editable) {
                var editorFactory = this.column.getEditor();
                this.currentEditor = editorFactory(this.column, this.model);
                this.model.events.trigger(TSGrid.TSGridEvents.EDIT, {
                    model: this.model,
                    column: this.column,
                    cell: this,
                    editor: this.currentEditor
                });
                this.undelegateEvents();
                if (withModelValue) {
                    this.currentEditor.setInitialModelValue(withModelValue);
                }
                this.currentEditor.render();
                setTimeout(function () {
                    _this.blur();
                    _this.$el.empty();
                    _this.$el.append(_this.currentEditor.$el);
                    _this.$el.addClass('editor');
                    _this.$el.addClass(_this.currentEditor.getEditorName());
                }, 10);
                this.editModeActive = true;
                this.model.events.trigger(TSGrid.TSGridEvents.EDITING, {
                    model: this.model,
                    column: this.column,
                    cell: this,
                    editor: this.currentEditor
                });
            }
        };
        Cell.prototype.renderError = function (model, column) {
            if (column == null || column.getName() == this.column.getName()) {
                this.$el.addClass("error");
            }
        };
        Cell.prototype.exitEditMode = function () {
            this.editModeActive = false;
            this.$el.removeClass("error");
            this.$el.removeClass(this.currentEditor.getEditorName());
            this.currentEditor.remove();
            delete this.currentEditor;
            this.$el.removeClass("editor");
            this.render();
        };
        Cell.prototype.remove = function () {
            if (this.currentEditor) {
                this.currentEditor.remove.apply(this.currentEditor, arguments);
                delete this.currentEditor;
            }
            return this;
        };
        return Cell;
    })(TSCore.App.UI.View);
    TSGrid.Cell = Cell;
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    (function (CellEditorAction) {
        CellEditorAction[CellEditorAction["ESC"] = 0] = "ESC";
        CellEditorAction[CellEditorAction["BLUR"] = 1] = "BLUR";
        CellEditorAction[CellEditorAction["ENTER"] = 2] = "ENTER";
    })(TSGrid.CellEditorAction || (TSGrid.CellEditorAction = {}));
    var CellEditorAction = TSGrid.CellEditorAction;
    var CellEditor = (function (_super) {
        __extends(CellEditor, _super);
        function CellEditor(column, model, editorName) {
            _super.call(this);
            this.setColumn(column);
            this.setModel(model);
            this.setEditorName(editorName);
            this.initialize();
        }
        CellEditor.prototype.setColumn = function (column) {
            this.column = column;
            return this;
        };
        CellEditor.prototype.getColumn = function () {
            return this.column;
        };
        CellEditor.prototype.setModel = function (model) {
            this.model = model;
            return this;
        };
        CellEditor.prototype.getModel = function () {
            return this.model;
        };
        CellEditor.prototype.setEditorName = function (editorName) {
            this.editorName = editorName;
            return this;
        };
        CellEditor.prototype.getEditorName = function () {
            return this.editorName;
        };
        CellEditor.prototype.setInitialModelValue = function (value) {
            this.initialModelValue = value;
            return this;
        };
        CellEditor.prototype.getInitialModelValue = function () {
            return this.initialModelValue;
        };
        CellEditor.prototype.setModelValue = function (value) {
            var setter = this.column.getSetter();
            if (setter) {
                setter(this.model, value);
            }
            else {
                this.model.set(this.column.getName(), value);
            }
            return this;
        };
        CellEditor.prototype.getModelValue = function () {
            var getter = this.column.getGetter();
            if (getter) {
                return getter(this.model);
            }
            return this.model.get(this.column.getName());
        };
        CellEditor.prototype.save = function (action, value) {
            var model = this.model;
            var column = this.column;
            var grid = column.getGrid();
            this.setModelValue(value);
            var editedEvent = {
                model: model,
                column: column,
                command: TSGrid.Command.fromAction(action),
            };
            grid.events.trigger(TSGrid.TSGridEvents.EDITED, editedEvent);
            model.events.trigger(TSGrid.TSGridEvents.EDITED, editedEvent);
        };
        CellEditor.prototype.cancel = function (action) {
            var model = this.model;
            var column = this.column;
            var grid = column.getGrid();
            var editedEvent = {
                model: model,
                column: column,
                command: TSGrid.Command.fromAction(action)
            };
            grid.events.trigger(TSGrid.TSGridEvents.EDITED, editedEvent);
            model.events.trigger(TSGrid.TSGridEvents.EDITED, editedEvent);
        };
        return CellEditor;
    })(TSCore.App.UI.View);
    TSGrid.CellEditor = CellEditor;
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var Column = (function () {
        function Column() {
            this._renderable = true;
            this._editOnInput = false;
            this._editable = false;
            this._allowNull = false;
            this._cellType = TSGrid.Cell;
            this._uniqId = parseInt(_.uniqueId());
        }
        Column.prototype.className = function (className) {
            this._className = className;
            return this;
        };
        Column.prototype.getClassName = function () {
            return this._className;
        };
        Column.prototype.getId = function () {
            return this._uniqId;
        };
        Column.prototype.setGrid = function (grid) {
            this._grid = grid;
        };
        Column.prototype.getGrid = function () {
            return this._grid;
        };
        Column.prototype.width = function (width) {
            this._width = width;
            return this;
        };
        Column.prototype.getWidth = function () {
            return this._width;
        };
        Column.prototype.name = function (name) {
            this._name = name;
            return this;
        };
        Column.prototype.getName = function () {
            return this._name;
        };
        Column.prototype.label = function (label) {
            this._label = label;
            return this;
        };
        Column.prototype.getLabel = function () {
            return this._label;
        };
        Column.prototype.renderable = function (renderable) {
            this._renderable = renderable;
            return this;
        };
        Column.prototype.getRenderable = function () {
            return this._renderable;
        };
        Column.prototype.editable = function (editable) {
            this._editable = editable;
            return this;
        };
        Column.prototype.getEditable = function () {
            return this._editable;
        };
        Column.prototype.editOnInput = function (editOnInput) {
            if (editOnInput === void 0) { editOnInput = true; }
            this._editOnInput = editOnInput;
            return this;
        };
        Column.prototype.getEditOnInput = function () {
            return this._editOnInput;
        };
        Column.prototype.getHeaderType = function () {
            return TSGrid.resolveNameToClass('header-cell');
        };
        Column.prototype.editor = function (editor) {
            this._editor = editor;
            return this;
        };
        Column.prototype.getEditor = function () {
            return this._editor;
        };
        Column.prototype.allowNull = function (allowNull) {
            if (allowNull === void 0) { allowNull = true; }
            this._allowNull = allowNull;
            return this;
        };
        Column.prototype.getAllowNull = function () {
            return this._allowNull;
        };
        Column.prototype.cellType = function (cellType) {
            this._cellType = cellType;
            return this;
        };
        Column.prototype.getCellType = function () {
            return this._cellType;
        };
        Column.prototype.setter = function (setter) {
            this._setter = setter;
            return this;
        };
        Column.prototype.getSetter = function () {
            return this._setter;
        };
        Column.prototype.getter = function (getter) {
            this._getter = getter;
            return this;
        };
        Column.prototype.getGetter = function () {
            return this._getter;
        };
        Column.prototype.parser = function (parser) {
            this._parser = parser;
            return this;
        };
        Column.prototype.getParser = function () {
            return this._parser;
        };
        Column.prototype.formatter = function (formatter) {
            this._formatter = formatter;
            return this;
        };
        Column.prototype.getFormatter = function () {
            return this._formatter;
        };
        return Column;
    })();
    TSGrid.Column = Column;
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var Grid = (function (_super) {
        __extends(Grid, _super);
        function Grid(header, body, columns) {
            _super.call(this);
            this.tagName = 'div';
            this.className = 'ts-grid';
            this.events = new TSCore.Events.EventEmitter();
            this.setHeader(header);
            this.setBody(body);
            this.setColumns(columns);
            this.initialize();
        }
        Grid.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
        };
        Grid.prototype.setHeader = function (header) {
            header.setGrid(this);
            this._header = header;
            return this;
        };
        Grid.prototype.getHeader = function () {
            return this._header;
        };
        Grid.prototype.setBody = function (body) {
            body.setGrid(this);
            this._body = body;
            return this;
        };
        Grid.prototype.getBody = function () {
            return this._body;
        };
        Grid.prototype.setColumns = function (columns) {
            var _this = this;
            var width = 0;
            columns.each(function (column) {
                column.setGrid(_this);
                width += column.getWidth();
            });
            this._width = width;
            this._columns = columns;
            return this;
        };
        Grid.prototype.getColumns = function () {
            return this._columns;
        };
        Grid.prototype.getInnerWidth = function () {
            return this._width;
        };
        Grid.prototype.getWidth = function () {
            return this._width + 2;
        };
        Grid.prototype.insertRow = function () {
            this._body.insertRow.apply(this._body, arguments);
            return this;
        };
        Grid.prototype.removeRow = function () {
            this._body.removeRow.apply(this._body, arguments);
            return this;
        };
        Grid.prototype.render = function () {
            this.$el.empty();
            if (this._header) {
                this.$el.append(this._header.render().$el);
            }
            this.$el.append(this._body.render().$el);
            this.delegateEvents();
            this.events.trigger(TSGrid.TSGridEvents.RENDERED);
            return this;
        };
        Grid.prototype.remove = function () {
            this._header && this._header.remove.apply(this._header, arguments);
            this._body.remove.apply(this._body, arguments);
            return _super.prototype.remove.call(this);
        };
        return Grid;
    })(TSCore.App.UI.View);
    TSGrid.Grid = Grid;
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var Header = (function (_super) {
        __extends(Header, _super);
        function Header(columns) {
            _super.call(this);
            this.tagName = 'div';
            this.className = 'ts-grid-header';
            this.columns = columns;
            this.initialize();
        }
        Header.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.row = new TSGrid.HeaderRow(this.columns, null);
        };
        Header.prototype.setGrid = function (grid) {
            this._grid = grid;
            return this;
        };
        Header.prototype.getGrid = function () {
            return this._grid;
        };
        Header.prototype.render = function () {
            var grid = this.getGrid();
            var $table = $('<table />');
            var $thead = $('<thead />');
            $table.append($thead);
            $thead.append(this.row.render().$el);
            $table.attr('width', grid.getInnerWidth());
            this.$el.append($table);
            this.delegateEvents();
            return this;
        };
        return Header;
    })(TSCore.App.UI.View);
    TSGrid.Header = Header;
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var HeaderCell = (function (_super) {
        __extends(HeaderCell, _super);
        function HeaderCell(column) {
            _super.call(this);
            this.tagName = 'th';
            this.viewEvents = {
                "click a": "click"
            };
            this.column = column;
            this.initialize();
        }
        HeaderCell.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
        };
        HeaderCell.prototype.click = function () {
        };
        HeaderCell.prototype.render = function () {
            this.$el.empty();
            var label = document.createTextNode(this.column.getLabel());
            this.$el.append(label);
            this.$el.addClass(this.column.getClassName());
            this.$el.attr('width', this.column.getWidth());
            this.delegateEvents();
            return this;
        };
        return HeaderCell;
    })(TSCore.App.UI.View);
    TSGrid.HeaderCell = HeaderCell;
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var Row = (function (_super) {
        __extends(Row, _super);
        function Row(columns, model) {
            _super.call(this);
            this.tagName = 'tr';
            this.columns = columns;
            this.setModel(model);
            this.cells = new TSCore.Data.List();
            this.initialize();
        }
        Row.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            this.columns.each(function (column) {
                _this.cells.add(_this.makeCell(column));
            });
        };
        Row.prototype.setModel = function (model) {
            if (!model)
                return;
            this.model = model;
            this.modelId = model.getId();
            return this;
        };
        Row.prototype.makeCell = function (column) {
            var cellType = column.getCellType();
            return new cellType(column, this.model);
        };
        Row.prototype.render = function () {
            this.$el.empty();
            var fragment = document.createDocumentFragment();
            this.cells.each(function (cell) {
                fragment.appendChild(cell.render().el);
            });
            this.el.appendChild(fragment);
            this.delegateEvents();
            return this;
        };
        Row.prototype.reset = function () {
        };
        return Row;
    })(TSCore.App.UI.View);
    TSGrid.Row = Row;
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var HeaderRow = (function (_super) {
        __extends(HeaderRow, _super);
        function HeaderRow() {
            _super.apply(this, arguments);
        }
        HeaderRow.prototype.makeCell = function (column) {
            var headerCell = column.getHeaderType();
            return new headerCell(column, this.model);
        };
        return HeaderRow;
    })(TSGrid.Row);
    TSGrid.HeaderRow = HeaderRow;
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    TSGrid.Extension = {};
    function resolveNameToClass(name, suffix) {
        if (suffix === void 0) { suffix = ''; }
        if (_.isString(name)) {
            var key = _.map(name.split('-'), function (e) {
                return e.slice(0, 1).toUpperCase() + e.slice(1);
            }).join('') + suffix;
            var klass = TSGrid[key] || TSGrid.Extension[key];
            if (_.isUndefined(klass)) {
                throw new ReferenceError("Class '" + key + "' not found");
            }
            return klass;
        }
        return name;
    }
    TSGrid.resolveNameToClass = resolveNameToClass;
    function callByNeed() {
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i - 0] = arguments[_i];
        }
        var value = arguments[0];
        if (!_.isFunction(value))
            return value;
        var context = arguments[1];
        var args = [].slice.call(arguments, 2);
        return value.apply(context, !!(args + '') ? args : []);
    }
    TSGrid.callByNeed = callByNeed;
    var TSGridEvents;
    (function (TSGridEvents) {
        TSGridEvents.RENDERED = "tsGrid:rendered";
        TSGridEvents.SORT = "tsGrid:sort";
        TSGridEvents.EDIT = "tsGrid:edit";
        TSGridEvents.EDITING = "tsGrid:editing";
        TSGridEvents.EDITED = "tsGrid:edited";
        TSGridEvents.ERROR = "tsGrid:error";
        TSGridEvents.NEXT = "tsGrid:next";
        TSGridEvents.NAVIGATE = "tsGrid:navigate";
    })(TSGridEvents = TSGrid.TSGridEvents || (TSGrid.TSGridEvents = {}));
})(TSGrid || (TSGrid = {}));
//# sourceMappingURL=ts-grid.js.map