var TSGrid;
(function (TSGrid) {
    (function (CommandTypes) {
        CommandTypes[CommandTypes["NONE"] = 0] = "NONE";
        CommandTypes[CommandTypes["UP"] = 1] = "UP";
        CommandTypes[CommandTypes["DOWN"] = 2] = "DOWN";
        CommandTypes[CommandTypes["LEFT"] = 3] = "LEFT";
        CommandTypes[CommandTypes["RIGHT"] = 4] = "RIGHT";
        CommandTypes[CommandTypes["TAB"] = 5] = "TAB";
        CommandTypes[CommandTypes["SHIFT_TAB"] = 6] = "SHIFT_TAB";
        CommandTypes[CommandTypes["ENTER"] = 7] = "ENTER";
        CommandTypes[CommandTypes["BACKSPACE"] = 8] = "BACKSPACE";
        CommandTypes[CommandTypes["DELETE"] = 9] = "DELETE";
        CommandTypes[CommandTypes["BLUR"] = 10] = "BLUR";
        CommandTypes[CommandTypes["ESC"] = 11] = "ESC";
    })(TSGrid.CommandTypes || (TSGrid.CommandTypes = {}));
    var CommandTypes = TSGrid.CommandTypes;
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var KeyCodes = TSCore.App.UI.KeyCodes;
    var Command = (function () {
        function Command() {
        }
        Command.prototype.type = function (type) {
            this._type = type;
        };
        Command.prototype.fromEvent = function (evt) {
            switch (true) {
                case (evt.type === 'blur'):
                    this._type = TSGrid.CommandTypes.BLUR;
                    break;
                case (evt.keyCode === KeyCodes.UP):
                    this._type = TSGrid.CommandTypes.UP;
                    break;
                case (evt.keyCode === KeyCodes.DOWN):
                    this._type = TSGrid.CommandTypes.DOWN;
                    break;
                case (evt.shiftKey && evt.keyCode === KeyCodes.TAB):
                    this._type = TSGrid.CommandTypes.SHIFT_TAB;
                    break;
                case (evt.keyCode === KeyCodes.LEFT):
                    this._type = TSGrid.CommandTypes.LEFT;
                    break;
                case (!evt.shiftKey && evt.keyCode === KeyCodes.TAB):
                    this._type = TSGrid.CommandTypes.TAB;
                    break;
                case (evt.keyCode === KeyCodes.RIGHT):
                    this._type = TSGrid.CommandTypes.RIGHT;
                    break;
                case (!evt.shiftKey && evt.keyCode === KeyCodes.ENTER):
                    this._type = TSGrid.CommandTypes.ENTER;
                    break;
                case (evt.keyCode === KeyCodes.BACKSPACE):
                    this._type = TSGrid.CommandTypes.BACKSPACE;
                    break;
                case (evt.keyCode === KeyCodes.DELETE):
                    this._type = TSGrid.CommandTypes.DELETE;
                    break;
                case (evt.keyCode === KeyCodes.ESCAPE):
                    this._type = TSGrid.CommandTypes.ESC;
                    break;
                default:
                    this._type = TSGrid.CommandTypes.NONE;
                    break;
            }
        };
        Command.prototype.blur = function () {
            return this._type === TSGrid.CommandTypes.BLUR;
        };
        Command.prototype.up = function () {
            return this._type === TSGrid.CommandTypes.UP;
        };
        Command.prototype.down = function () {
            return this._type === TSGrid.CommandTypes.DOWN;
        };
        Command.prototype.left = function () {
            return this._type === TSGrid.CommandTypes.LEFT;
        };
        Command.prototype.right = function () {
            return this._type === TSGrid.CommandTypes.RIGHT;
        };
        Command.prototype.shiftTab = function () {
            return this._type === TSGrid.CommandTypes.SHIFT_TAB;
        };
        Command.prototype.tab = function () {
            return this._type === TSGrid.CommandTypes.TAB;
        };
        Command.prototype.enter = function () {
            return this._type === TSGrid.CommandTypes.ENTER;
        };
        Command.prototype.backspace = function () {
            return this._type === TSGrid.CommandTypes.BACKSPACE;
        };
        Command.prototype.delete = function () {
            return this._type === TSGrid.CommandTypes.DELETE;
        };
        Command.prototype.esc = function () {
            return this._type === TSGrid.CommandTypes.ESC;
        };
        Command.fromEvent = function (evt) {
            var command = new Command();
            command.fromEvent(evt);
            return command;
        };
        Command.fromType = function (type) {
            var command = new Command();
            command.type(type);
            return command;
        };
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
        function Body(delegate, columns, collection, rowType) {
            if (rowType === void 0) { rowType = TSGrid.Row; }
            _super.call(this);
            this.tagName = 'div';
            this.className = 'ts-grid-body';
            this.cols = new TSCore.Data.List();
            this.rowType = TSGrid.Row;
            this.rowsByModelId = new TSCore.Data.Dictionary();
            this.events = new TSCore.Events.EventEmitter();
            this._delegate = delegate;
            this.columns = columns;
            this.collection = collection;
            this.rowType = rowType;
            this.initialize();
        }
        Body.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            this.rows = new TSCore.Data.List();
            var models = this.collection.all();
            this.models = new TSCore.Data.SortedList(models, this._delegate.bodyPrimaryKeyForModels(this));
            this.models.setSortPredicate(this._delegate.bodyDefaultSortPredicateForModels(this), this._delegate.bodyDefaultSortDirectionForModels(this));
            this.rowsByModelId.clear();
            this.models.each(function (model) {
                var row = new _this.rowType(_this.columns, model);
                _this.rowsByModelId.set(model.getId(), row);
                _this.rows.add(row);
            });
            this.collection.events.on(TSCore.Data.CollectionEvents.ADD, function (evt) { return _this.addModels(evt); });
            this.collection.events.on(TSCore.Data.CollectionEvents.REMOVE, function (evt) { return _this.removeModels(evt); });
            this.models.events.on(TSCore.Data.SortedListEvents.ADD, function (evt) { return _this.addRows(evt); });
            this.models.events.on(TSCore.Data.SortedListEvents.REMOVE, function (evt) { return _this.removeRows(evt); });
            this.models.events.on(TSCore.Data.SortedListEvents.SORT, function (evt) { return _this.sortRows(evt); });
            this.columns.each(function (column) {
                column.events.on(TSGrid.ColumnEvents.CHANGED_WIDTH, function (e) { return _this.columnChangedWidth(e); });
            });
        };
        Body.prototype.columnChangedWidth = function (e) {
            var column = e.params.column;
            var columnIndex = this.columns.indexOf(column);
            var col = this.cols.get(columnIndex);
            if (col) {
                col.width(column.getWidth());
            }
        };
        Body.prototype.getDelegate = function () {
            return this._delegate;
        };
        Body.prototype.addModels = function (evt) {
            var _this = this;
            var operations = evt.params.operations;
            _.each(operations, function (operation) {
                _this.models.add(operation.item);
            });
        };
        Body.prototype.removeModels = function (evt) {
            var _this = this;
            var operations = evt.params.operations;
            _.each(operations, function (operation) {
                _this.models.remove(operation.item);
            });
        };
        Body.prototype.setGrid = function (grid) {
            this._grid = grid;
            grid.events.on(TSGrid.TSGridEvents.EDITED, this.moveToNextCell, this);
            grid.events.on(TSGrid.TSGridEvents.NAVIGATE, this.moveToNextCell, this);
            grid.events.on(TSGrid.TSGridEvents.CLICK, this.moveToCell, this);
        };
        Body.prototype.getGrid = function () {
            return this._grid;
        };
        Body.prototype.prependEmptyRow = function () {
            var _this = this;
            this.emptyRow = new this.rowType(this.columns, this._delegate.bodyModelForEmptyRow(this));
            this.emptyRow.events.on(TSGrid.RowEvents.CHANGED, function (e) { return _this.emptyRowDidChange(e); });
            this.rows.prepend(this.emptyRow);
            this.insertRow(this.emptyRow);
        };
        Body.prototype.removeEmptyRow = function () {
            if (this.emptyRow) {
                this.rows.remove(this.emptyRow);
                this.emptyRow.remove();
            }
        };
        Body.prototype.emptyRowDidChange = function (e) {
            var row = e.params.row;
            row.valid = this._delegate.bodyValidateModel(this, row.model);
        };
        Body.prototype.addRow = function (model, index, items) {
            if (_.isUndefined(items)) {
                this.collection.add(model);
                return;
            }
            var row = new this.rowType(this.columns, model);
            this.rowsByModelId.set(model.getId(), row);
            this.rows.add(row);
            this.insertRow(row);
        };
        Body.prototype.insertRow = function (row) {
            var index = this.rows.indexOf(row);
            var $children = this.$tbody.children();
            var $rowEl = row.render().$el;
            if (index >= $children.length) {
                this.$tbody.append($rowEl);
            }
            else {
                $children.eq(index).before($rowEl);
            }
        };
        Body.prototype.addRows = function (evt) {
            var _this = this;
            var operations = evt.params.operations;
            _.each(operations, function (operation) {
                _this.addRow(operation.item, operation.index, _this.collection);
            });
        };
        Body.prototype.removeRows = function (evt) {
            var _this = this;
            var operations = evt.params.operations;
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
        Body.prototype.sortRows = function (e) {
            var _this = this;
            this.deactivateCell();
            this.rows.clear();
            this.$tbody.children().detach();
            this.models.each(function (model) {
                var row = _this.rowsByModelId.get(model.getId());
                _this.rows.add(row);
                _this.$tbody.append(row.$el);
            });
        };
        Body.prototype.refresh = function (evt) {
            var _this = this;
            var grid = this.getGrid();
            this.rows.each(function (row) {
                row.remove();
            });
            this.rows = new TSCore.Data.List();
            this.rowsByModelId.clear();
            this.models.each(function (model) {
                var row = new _this.rowType(_this.columns, model);
                _this.rowsByModelId.set(model.getId(), row);
                _this.rows.add(row);
            });
            this.render();
            grid.events.trigger(TSGrid.TSGridEvents.REFRESH, { body: this });
        };
        Body.prototype.render = function () {
            var _this = this;
            var grid = this.getGrid();
            this.$el.empty();
            this.$table = $('<table />');
            this.$tbody = $('<tbody />');
            this.$colgroup = $('<colgroup />');
            this.cols.clear();
            this.columns.each(function (column) {
                var $col = $('<col />');
                $col.css('width', column.getWidth());
                _this.$colgroup.append($col);
                _this.cols.add($col);
            });
            this.$table.append(this.$colgroup);
            this.$table.append(this.$tbody);
            this.rows.each(function (row) {
                _this.$tbody.append(row.render().$el);
            });
            this.$table.attr('width', grid.getInnerWidth());
            this.$el.append(this.$table);
            this.delegateEvents();
            return this;
        };
        Body.prototype.remove = function () {
            this.rows.each(function (row) {
                row.remove.apply(row, arguments);
            });
            _super.prototype.remove.call(this);
            return this;
        };
        Body.prototype.getActiveCell = function () {
            var model = this.activePosition.model;
            var column = this.activePosition.column;
            return this.getCell(model, column);
        };
        Body.prototype.getCell = function (model, column) {
            var row = this.rows.whereFirst({ modelId: model.getId() });
            var i = this.rows.indexOf(row);
            var j = this.columns.indexOf(column);
            return this.rows.get(i).cells.get(j);
        };
        Body.prototype.moveToCell = function (evt) {
            var model = evt.params.model;
            var row = this.rows.whereFirst({ modelId: model.getId() });
            var column = evt.params.column;
            var cell = this.getCell(model, column);
            this.activate(row, cell);
        };
        Body.prototype.deactivateCell = function () {
            if (this.activeRow) {
                this.activeRow.setActive(false);
            }
            if (this.activeCell) {
                this.activeCell.deactivate();
            }
        };
        Body.prototype.activate = function (row, cell) {
            if (this.beforeActivateCell(cell.column, row.model) === false) {
                return;
            }
            if (cell.column.getEditable() === false) {
                return;
            }
            if (this.activeRow !== row) {
                var oldRow = this.activeRow;
                this.activeRow = row;
                this.changedRow(oldRow, row);
            }
            if (this.activeCell !== cell) {
                var oldCell = this.activeCell;
                if (this.activeCell) {
                    this.activeCell.deactivate();
                }
                this.activeCell = cell;
                this.changedCell(oldCell, cell);
            }
            if (cell.isActivated()) {
                cell.enterEditMode();
            }
            else {
                cell.activate();
            }
        };
        Body.prototype.changedRow = function (fromRow, toRow) {
            var _this = this;
            if (fromRow) {
                fromRow.setActive(false);
            }
            if (toRow) {
                toRow.setActive(true);
            }
            if (fromRow && fromRow !== this.emptyRow) {
                fromRow.valid = this._delegate.bodyValidateModel(this, fromRow.model);
                var shouldUpdate = this._delegate.bodyShouldUpdateModel(this, fromRow.model);
                if (fromRow.valid && shouldUpdate) {
                    fromRow.setLoading(true);
                    this._delegate.bodyUpdateModel(this, fromRow.model).then(function (model) {
                        fromRow.setLoading(false);
                        _this._delegate.bodyAfterUpdateModel(_this, fromRow.model);
                    });
                }
            }
            if (fromRow && fromRow === this.emptyRow && this.emptyRow.valid) {
                var rowModel = this.emptyRow.model;
                this._delegate.bodyBeforeCreateModel(this, rowModel);
                this.emptyRow.setLoading(true);
                this._delegate.bodyCreateModel(this, rowModel).then(function (model) {
                    _this.emptyRow.setLoading(false);
                    _this.models.add(model);
                    _this._delegate.bodyAfterCreateModel(_this, model);
                    _this.focusEmptyRow();
                });
            }
            this.events.trigger(TSGrid.BodyEvents.CHANGED_ROW, { fromRow: fromRow, toRow: toRow });
        };
        Body.prototype.focusEmptyRow = function () {
            this.activeRow = null;
            this.activeCell = null;
            var row = this.rows.get(0);
            var cell = row.cells.get(0);
            this.activate(row, cell);
        };
        Body.prototype.changedCell = function (fromCell, toCell) {
            this.events.trigger(TSGrid.BodyEvents.CHANGED_CELL, { fromCell: fromCell, toCell: toCell });
        };
        Body.prototype.moveToNextCell = function (evt) {
            var grid = this.getGrid();
            var model = evt.params.model;
            var column = evt.params.column;
            var cmd = evt.params.command;
            var cell, renderable, editable, m, n;
            var row = this.rows.whereFirst({ modelId: model.id });
            var i = this.rows.indexOf(row);
            var j = this.columns.indexOf(column);
            if (j === -1)
                return this;
            if (cmd.enter() || cmd.esc() || cmd.blur()) {
                if (this.activeCell.editModeActive) {
                    this.activeCell.exitEditMode();
                    this.activeCell.activate();
                }
            }
            if (cmd.enter() || cmd.left() || cmd.right() || cmd.up() || cmd.down() || cmd.shiftTab() || cmd.tab()) {
                var l = this.columns.length;
                var maxOffset = l * this.rows.length;
                if (cmd.up() || cmd.down() || cmd.enter()) {
                    m = i + (cmd.up() ? -1 : 1);
                    var row = this.rows.get(m);
                    if (row) {
                        cell = row.cells.get(j);
                        if (TSGrid.callByNeed(cell.column.getEditable(), cell.column, model)) {
                            this.activate(row, cell);
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
                else if (cmd.left() || cmd.right() || cmd.shiftTab || cmd.tab()) {
                    var right = cmd.right() || cmd.tab();
                    for (var offset = i * l + j + (right ? 1 : -1); offset >= 0 && offset < maxOffset; right ? offset++ : offset--) {
                        m = ~~(offset / l);
                        n = offset - m * l;
                        cell = this.rows.get(m).cells.get(n);
                        renderable = TSGrid.callByNeed(cell.column.getRenderable(), cell.column, cell.model);
                        editable = TSGrid.callByNeed(cell.column.getEditable(), cell.column, model);
                        if (renderable && editable) {
                            this.activate(row, cell);
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
        Body.prototype.beforeActivateCell = function (column, model) {
            return true;
        };
        return Body;
    })(TSCore.App.UI.View);
    TSGrid.Body = Body;
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var BodyEvents;
    (function (BodyEvents) {
        BodyEvents.CHANGED_ROW = 'body:changedRow';
        BodyEvents.CHANGED_CELL = 'body:changedCell';
    })(BodyEvents = TSGrid.BodyEvents || (TSGrid.BodyEvents = {}));
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
                "keypress": "keypress",
                "keydown": "keydown"
            };
            this.events = new TSCore.Events.EventEmitter();
            this.activated = false;
            this._validationEnabled = false;
            this.column = column;
            this.model = model;
            this.initialize();
        }
        Cell.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            if (TSGrid.callByNeed(this.column.getEditable(), this.column, this.model))
                this.$el.addClass("editable");
            if (TSGrid.callByNeed(this.column.getRenderable(), this.column, this.model))
                this.$el.addClass("renderable");
        };
        Cell.prototype.validationEnabled = function (validationEnabled) {
            if (validationEnabled === void 0) { validationEnabled = true; }
            this._validationEnabled = validationEnabled;
            return this;
        };
        Cell.prototype.getValidationEnabled = function () {
            return this._validationEnabled;
        };
        Cell.prototype.setModelValue = function (value) {
            var setter = this.column.getSetter();
            if (setter) {
                setter(this.model, value);
            }
            else {
                this.model.set(this.column.getName(), value);
            }
            return this;
        };
        Cell.prototype.getModelValue = function () {
            var getter = this.column.getGetter();
            if (getter) {
                return getter(this.model);
            }
            return this.model.get(this.column.getName());
        };
        Cell.prototype.getContentWidth = function () {
            return this.$cellLabel.width();
        };
        Cell.prototype.render = function () {
            this.$el.empty();
            var formatter = this.column.getFormatter();
            var getter = this.column.getGetter();
            var modelValue = getter ? getter(this.model) : this.model.get(this.column.getName());
            var value = formatter ? formatter(this.model, this) : modelValue;
            this.$cellLabel = $('<span class="cell-label"></span>');
            this.$cellLabel.html(value);
            this.$el.append(this.$cellLabel);
            var columnClassName = this.column.getClassName();
            if (columnClassName) {
                this.$el.addClass(columnClassName);
            }
            if (this.getValidationEnabled() && this.model.isValid(this.column.getName()) === false && this.model.isDirty(this.column.getName()) === true) {
                this.$el.addClass('warning-state');
            }
            else {
                this.$el.removeClass('warning-state');
            }
            this.delegateEvents();
            return this;
        };
        Cell.prototype.keypress = function (evt) {
            var cellInput = Cell.CELL_INPUT.indexOf(evt.keyCode) !== -1;
            if (this.column.getEditOnInput() && cellInput && !evt.metaKey && !evt.ctrlKey) {
                var char = String.fromCharCode(evt.keyCode);
                this.enterEditMode(char);
            }
        };
        Cell.prototype.keydown = function (evt) {
            var cmd = TSGrid.Command.fromEvent(evt);
            if (cmd.enter()) {
                this.enterEditMode();
            }
            if (cmd.backspace() || cmd.delete()) {
                evt.preventDefault();
                evt.stopPropagation();
                if (this.column.getAllowClear()) {
                    this.clear();
                    this.activate();
                }
            }
            if (cmd.left() || cmd.right() || cmd.up() || cmd.down() || cmd.shiftTab() || cmd.tab()) {
                evt.preventDefault();
                var grid = this.column.getGrid();
                grid.events.trigger(TSGrid.TSGridEvents.NAVIGATE, {
                    column: this.column,
                    model: this.model,
                    command: cmd
                });
            }
        };
        Cell.prototype.click = function (event) {
            var grid = this.column.getGrid();
            grid.events.trigger(TSGrid.TSGridEvents.CLICK, {
                column: this.column,
                model: this.model,
                event: event
            });
        };
        Cell.prototype.blur = function () {
            this.$el.removeClass('active');
            this.$el.removeAttr('tabindex');
        };
        Cell.prototype.activate = function () {
            this.$el.attr('tabindex', 0);
            this.$el.addClass('active');
            this.$el.focus();
            this.activated = true;
        };
        Cell.prototype.isActivated = function () {
            return this.activated;
        };
        Cell.prototype.deactivate = function () {
            if (this.editModeActive) {
                this.exitEditMode();
            }
            this.blur();
            this.activated = false;
        };
        Cell.prototype.clear = function () {
            var onClear = this.column.getOnClear();
            var setter = this.column.getSetter();
            if (onClear) {
                onClear(this.model);
            }
            else if (setter) {
                setter(this.model, null);
            }
            else {
                this.model.set(this.column.getName(), null);
            }
            this.events.trigger(TSGrid.CellEvents.CLEARED, { cell: this });
        };
        Cell.prototype.enterEditMode = function (withModelValue) {
            var _this = this;
            if (this.editModeActive)
                return;
            var editable = TSGrid.callByNeed(this.column.getEditable(), this.column, this.model);
            if (editable) {
                var editorFactory = this.column.getEditor();
                this.currentEditor = editorFactory(this, this.column, this.model);
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
                this.currentEditor.events.on(TSGrid.CellEditorEvents.SAVE, function (e) { return _this.cellEditorOnSave(e); });
                this.currentEditor.events.on(TSGrid.CellEditorEvents.CANCEL, function (e) { return _this.cellEditorOnCancel(e); });
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
        Cell.prototype.cellEditorOnSave = function (e) {
            var modelValue = e.params.modelValue;
            this.setModelValue(modelValue);
            this.events.trigger(TSGrid.CellEvents.CHANGED, e.params);
            var grid = this.column.getGrid();
            grid.events.trigger(TSGrid.TSGridEvents.EDITED, e.params);
        };
        Cell.prototype.cellEditorOnCancel = function (e) {
            var grid = this.column.getGrid();
            grid.events.trigger(TSGrid.TSGridEvents.EDITED, e.params);
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
        Cell.CELL_INPUT = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 167, 177, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 91, 92, 93, 94, 95, 96, 97, 98, 99, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90];
        return Cell;
    })(TSCore.App.UI.View);
    TSGrid.Cell = Cell;
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var CellEditor = (function (_super) {
        __extends(CellEditor, _super);
        function CellEditor(column, model, editorName) {
            _super.call(this);
            this.events = new TSCore.Events.EventEmitter;
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
        CellEditor.prototype.getModelValue = function () {
            var getter = this.column.getGetter();
            if (getter) {
                return getter(this.model);
            }
            return this.model.get(this.column.getName());
        };
        CellEditor.prototype.save = function (cmd, value) {
            var model = this.model;
            var column = this.column;
            var editedEvent = {
                modelValue: value,
                model: model,
                column: column,
                command: cmd,
            };
            this.events.trigger(TSGrid.CellEditorEvents.SAVE, editedEvent);
        };
        CellEditor.prototype.cancel = function (cmd) {
            var model = this.model;
            var column = this.column;
            var editedEvent = {
                model: model,
                column: column,
                command: cmd
            };
            this.events.trigger(TSGrid.CellEditorEvents.CANCEL, editedEvent);
        };
        return CellEditor;
    })(TSCore.App.UI.View);
    TSGrid.CellEditor = CellEditor;
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var CellEditorEvents;
    (function (CellEditorEvents) {
        CellEditorEvents.SAVE = 'cellEditor:save';
        CellEditorEvents.CANCEL = 'cellEditor:cancel';
    })(CellEditorEvents = TSGrid.CellEditorEvents || (TSGrid.CellEditorEvents = {}));
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var CellEvents;
    (function (CellEvents) {
        CellEvents.CHANGED = 'cell:changed';
        CellEvents.CLEARED = 'cell:cleared';
    })(CellEvents = TSGrid.CellEvents || (TSGrid.CellEvents = {}));
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var Column = (function () {
        function Column() {
            this._resizable = false;
            this._renderable = true;
            this._editOnInput = false;
            this._editable = false;
            this._sortable = false;
            this._allowClear = false;
            this._cellType = TSGrid.Cell;
            this.events = new TSCore.Events.EventEmitter();
            this._uniqId = parseInt(_.uniqueId());
        }
        Column.prototype.descriptionFormatter = function (descriptionFormatter) {
            this._descriptionFormatter = descriptionFormatter;
            return this;
        };
        Column.prototype.getDescriptionFormatter = function () {
            return this._descriptionFormatter;
        };
        Column.prototype.getDescription = function () {
            if (this._descriptionFormatter) {
                return this._descriptionFormatter(this);
            }
            return null;
        };
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
        Column.prototype.resizable = function (resizable) {
            if (resizable === void 0) { resizable = true; }
            this._resizable = resizable;
            return this;
        };
        Column.prototype.getResizable = function () {
            return this._resizable;
        };
        Column.prototype.minWidth = function (minWidth) {
            this._minWidth = minWidth;
            return this;
        };
        Column.prototype.getMinWidth = function () {
            return this._minWidth;
        };
        Column.prototype.maxWidth = function (maxWidth) {
            this._maxWidth = maxWidth;
            return this;
        };
        Column.prototype.getMaxWidth = function () {
            return this._maxWidth;
        };
        Column.prototype.width = function (width) {
            var oldWidth = this._width;
            this._width = width;
            this.events.trigger(TSGrid.ColumnEvents.CHANGED_WIDTH, { column: this, fromWidth: oldWidth, toWidth: width });
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
        Column.prototype.titleFormatter = function (title) {
            this._titleFormatter = title;
            return this;
        };
        Column.prototype.getTitleFormatter = function () {
            return this._titleFormatter;
        };
        Column.prototype.getTitle = function () {
            return this._titleFormatter(this);
        };
        Column.prototype.renderable = function (renderable) {
            this._renderable = renderable;
            return this;
        };
        Column.prototype.getRenderable = function () {
            return this._renderable;
        };
        Column.prototype.editable = function (editable) {
            if (editable === void 0) { editable = true; }
            this._editable = editable;
            return this;
        };
        Column.prototype.getEditable = function () {
            return this._editable;
        };
        Column.prototype.sortable = function (sortable) {
            if (sortable === void 0) { sortable = true; }
            this._sortable = sortable;
            return this;
        };
        Column.prototype.getSortable = function () {
            return this._sortable;
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
        Column.prototype.allowClear = function (allowClear) {
            if (allowClear === void 0) { allowClear = true; }
            this._allowClear = allowClear;
            return this;
        };
        Column.prototype.getAllowClear = function () {
            return this._allowClear;
        };
        Column.prototype.onClear = function (onClear) {
            this._onClear = onClear;
            return this;
        };
        Column.prototype.getOnClear = function () {
            return this._onClear;
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
    var ColumnEvents;
    (function (ColumnEvents) {
        ColumnEvents.CHANGED_WIDTH = 'changedWidth';
    })(ColumnEvents = TSGrid.ColumnEvents || (TSGrid.ColumnEvents = {}));
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var ColumnResizer = (function (_super) {
        __extends(ColumnResizer, _super);
        function ColumnResizer() {
            _super.call(this);
            this.tagName = 'div';
            this.className = 'manualColumnResizer';
            this.clicks = 0;
            this.delay = 400;
            this.viewEvents = {
                "mousedown": "mousedown",
                "mouseup": "mouseup",
                "dblclick": "dblclick"
            };
            this.events = new TSCore.Events.EventEmitter();
            this._active = false;
            this.initialize();
        }
        ColumnResizer.prototype.mousedown = function () {
            var _this = this;
            event.preventDefault();
            this.clicks++;
            setTimeout(function () {
                _this.clicks = 0;
            }, this.delay);
            if (this.clicks === 2) {
                this.events.trigger(TSGrid.ColumnResizerEvents.DBLCLICK, { columnResizer: this });
                this.clicks = 0;
            }
            else {
                this.events.trigger(TSGrid.ColumnResizerEvents.MOUSEDOWN, { columnResizer: this });
            }
        };
        ColumnResizer.prototype.mouseup = function () {
            this.events.trigger(TSGrid.ColumnResizerEvents.MOUSEUP, { columnResizer: this });
        };
        ColumnResizer.prototype.setActive = function (active) {
            if (this._active !== active) {
                if (active) {
                    this.$el.addClass('active');
                }
                else {
                    this.$el.removeClass('active');
                }
            }
            this._active = active;
            return this;
        };
        ColumnResizer.prototype.getActive = function () {
            return this._active;
        };
        return ColumnResizer;
    })(TSCore.App.UI.View);
    TSGrid.ColumnResizer = ColumnResizer;
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var ColumnResizerEvents;
    (function (ColumnResizerEvents) {
        ColumnResizerEvents.MOUSEUP = 'mouseup';
        ColumnResizerEvents.MOUSEDOWN = 'mousedown';
        ColumnResizerEvents.DBLCLICK = 'dblclick';
    })(ColumnResizerEvents = TSGrid.ColumnResizerEvents || (TSGrid.ColumnResizerEvents = {}));
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var ColumnResizerGuide = (function (_super) {
        __extends(ColumnResizerGuide, _super);
        function ColumnResizerGuide() {
            _super.call(this);
            this.tagName = 'div';
            this.className = 'manualColumnResizerGuide';
            this._active = false;
            this.initialize();
        }
        ColumnResizerGuide.prototype.setActive = function (active) {
            if (this._active !== active) {
                if (active) {
                    this.$el.addClass('active');
                }
                else {
                    this.$el.removeClass('active');
                }
            }
            this._active = active;
            return this;
        };
        ColumnResizerGuide.prototype.getActive = function () {
            return this._active;
        };
        return ColumnResizerGuide;
    })(TSCore.App.UI.View);
    TSGrid.ColumnResizerGuide = ColumnResizerGuide;
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var SortedListDirection = TSCore.Data.SortedListDirection;
    var Grid = (function (_super) {
        __extends(Grid, _super);
        function Grid(header, body, columns) {
            _super.call(this);
            this.tagName = 'div';
            this.className = 'ts-grid';
            this.events = new TSCore.Events.EventEmitter();
            this._columnResizer = new TSGrid.ColumnResizer;
            this._columnResizerGuide = new TSGrid.ColumnResizerGuide;
            this.setHeader(header);
            this.setBody(body);
            this.setColumns(columns);
            this.initialize();
        }
        Grid.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            $(document).on('mouseup', function (e) { return _this.documentOnMouseUp(e); });
            $(document).on('mouseleave', function (e) { return _this.documentOnMouseLeave(e); });
            $(document).on('mousemove', function (e) { return _this.documentOnMouseMove(e); });
        };
        Grid.prototype.documentOnMouseLeave = function (e) {
            this.resetColumnResizer();
        };
        Grid.prototype.resetColumnResizer = function () {
            this._columnResizer.setActive(false);
            this._columnResizerGuide.setActive(false);
            this.createColumnResizer();
            this._resizeHeaderCell = null;
        };
        Grid.prototype.documentOnMouseMove = function (e) {
            this.mousePageOffsetX = e.pageX;
            if (this._columnResizer.getActive()) {
                this.positionColumnResizer(this.mousePageOffsetX);
            }
        };
        Grid.prototype.positionColumnResizer = function (offsetX) {
            var bodyOuterHeight = this._body.$el.height();
            var bodyOffset = this._body.$el.offset();
            var columnResizerOffset = this._columnResizer.$el.offset();
            var columnResizerWidth = this._columnResizer.$el.width();
            var columnResizerGuideOuterWidth = this._columnResizerGuide.$el.outerWidth();
            var guideCorrection = columnResizerWidth - columnResizerGuideOuterWidth;
            this._columnResizer.$el.offset({
                top: columnResizerOffset.top,
                left: offsetX ? offsetX : columnResizerOffset.left
            });
            this._columnResizerGuide.$el.offset({
                top: bodyOffset.top,
                left: (offsetX ? offsetX : columnResizerOffset.left) + guideCorrection
            });
            this._columnResizerGuide.$el.height(bodyOuterHeight);
        };
        Grid.prototype.documentOnMouseUp = function (e) {
            if (!this._columnResizer.getActive()) {
                return;
            }
            this._columnResizer.setActive(false);
            this._columnResizerGuide.setActive(false);
            var movedX = Math.abs(this.mousePageOffsetX - this.columnResizeStartOffsetX);
            if (movedX < 5) {
                this.positionColumnResizerAtHeaderCell(this._resizeHeaderCell);
                this._resizeHeaderCell = null;
                return;
            }
            this.createColumnResizer();
            var headerCell = this._resizeHeaderCell;
            this._resizeHeaderCell = null;
            var minWidth = headerCell.column.getMinWidth();
            var maxWidth = headerCell.column.getMaxWidth();
            var width = headerCell.column.getWidth();
            var calculatedWidth = width + (this.mousePageOffsetX - this.columnResizeStartOffsetX);
            var newWidth = Math.min(Math.max(calculatedWidth, minWidth), maxWidth);
            if (headerCell.column.getResizable()) {
                headerCell.column.width(newWidth);
            }
        };
        Grid.prototype.createColumnResizer = function () {
            var _this = this;
            if (this._columnResizer) {
                this._columnResizer.remove();
            }
            if (this._columnResizerGuide) {
                this._columnResizerGuide.remove();
            }
            this._columnResizer = new TSGrid.ColumnResizer;
            this._columnResizerGuide = new TSGrid.ColumnResizerGuide;
            this._columnResizer.events.on(TSGrid.ColumnResizerEvents.MOUSEDOWN, function (e) { return _this.columnResizerOnMouseDown(e); });
            this._columnResizer.events.on(TSGrid.ColumnResizerEvents.DBLCLICK, function (e) { return _this.columnResizerOnDoubleClick(e); });
            this.$el.append(this._columnResizer.render().$el);
            this.$el.append(this._columnResizerGuide.render().$el);
        };
        Grid.prototype.columnResizerOnMouseDown = function (e) {
            this.columnResizeStartOffsetX = this._columnResizer.$el.offset().left;
            this._columnResizer.setActive(true);
            this._columnResizerGuide.setActive(true);
            this._resizeHeaderCell = this._lastHeaderCell;
            this.positionColumnResizer();
        };
        Grid.prototype.columnResizerOnDoubleClick = function (e) {
            var column = this._lastHeaderCell.column;
            var columnIndex = this._columns.indexOf(column);
            var body = this.getBody();
            var maxContentWidth = 0;
            body.rows.each(function (row) {
                var cell = row.cells.get(columnIndex);
                var contentWidth = cell.getContentWidth();
                maxContentWidth = contentWidth > maxContentWidth ? contentWidth : maxContentWidth;
            });
            var calculatedWidth = maxContentWidth + 14;
            var minWidth = column.getMinWidth();
            var maxWidth = column.getMaxWidth();
            var width = column.getWidth();
            var newWidth = Math.min(Math.max(calculatedWidth, minWidth), maxWidth);
            column.width(newWidth);
            this.createColumnResizer();
        };
        Grid.prototype.sort = function (sortPredicate, sortDirection) {
            this._body.models.setSortPredicate(sortPredicate, sortDirection);
            this.afterSort(sortPredicate, sortDirection);
        };
        Grid.prototype.afterSort = function (sortPredicate, sortDirection) {
            if (!this._header) {
                return;
            }
            var headerRow = this._header.row;
            headerRow.cells.each(function (cell) {
                if (cell.column.getName() === sortPredicate) {
                    cell.setSortDirection(sortDirection);
                }
                else {
                    cell.setSortDirection(null);
                }
            });
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
            this._columns = columns;
            this.calculateWidth();
            return this;
        };
        Grid.prototype.calculateWidth = function () {
            var _this = this;
            var width = 0;
            this._columns.each(function (column) {
                column.setGrid(_this);
                width += column.getWidth();
            });
            this._width = width;
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
        Grid.prototype.render = function () {
            this.$el.empty();
            if (this._header) {
                this.$el.append(this._header.render().$el);
                this.listenHeaderCells();
            }
            this.$el.append(this._body.render().$el);
            this.createColumnResizer();
            this.delegateEvents();
            this.events.trigger(TSGrid.TSGridEvents.RENDERED);
            return this;
        };
        Grid.prototype.listenHeaderCells = function () {
            var _this = this;
            var headerRow = this._header.row;
            headerRow.cells.each(function (cell) {
                cell.events.on(TSGrid.HeaderCellEvents.CLICK, function (e) { return _this.headerCellOnClick(e); });
                cell.events.on(TSGrid.HeaderCellEvents.MOUSEENTER, function (e) { return _this.headerCellOnMouseEnter(e); });
                cell.events.on(TSGrid.HeaderCellEvents.MOUSELEAVE, function (e) { return _this.headerCellOnMouseLeave(e); });
                cell.column.events.on(TSGrid.ColumnEvents.CHANGED_WIDTH, function (e) { return _this.columnChangedWidth(e); });
            });
        };
        Grid.prototype.columnChangedWidth = function (e) {
            this.calculateWidth();
            this._header.$table.attr('width', this.getInnerWidth());
            this._body.$table.attr('width', this.getInnerWidth());
            this.events.trigger(TSGrid.TSGridEvents.CHANGED_WIDTH, { grid: this });
        };
        Grid.prototype.headerCellOnClick = function (e) {
            var headerRow = this._header.row;
            var headerCell = e.params.headerCell;
            if (headerCell.column.getSortable()) {
                this.sortName(headerCell.column.getName());
            }
        };
        Grid.prototype.headerCellOnMouseEnter = function (e) {
            var headerCell = e.params.headerCell;
            this._lastHeaderCell = headerCell;
            this.positionColumnResizerAtHeaderCell(headerCell);
        };
        Grid.prototype.headerCellOnMouseLeave = function (e) {
            var headerCell = e.params.headerCell;
        };
        Grid.prototype.positionColumnResizerAtHeaderCell = function (headerCell) {
            if (this._columnResizer.getActive() || headerCell.column.getResizable() === false) {
                return;
            }
            var headerCellOuterHeight = headerCell.$el.outerHeight();
            var headerCellOffset = headerCell.$el.offset();
            var columnResizerWidth = this._columnResizer.$el.width();
            this._columnResizer.$el.offset({
                top: headerCellOffset.top,
                left: headerCellOffset.left + headerCell.column.getWidth() - columnResizerWidth + 1
            });
            this._columnResizer.$el.height(headerCellOuterHeight);
        };
        Grid.prototype.sortName = function (name) {
            var sortPredicate = this._body.models.getSortPredicate();
            var sortDirection = this._body.models.getSortDirection();
            var direction = sortDirection === TSCore.Data.SortedListDirection.ASCENDING ? TSCore.Data.SortedListDirection.DESCENDING : TSCore.Data.SortedListDirection.ASCENDING;
            if (name === sortPredicate) {
                switch (sortDirection) {
                    case SortedListDirection.ASCENDING:
                        direction = SortedListDirection.DESCENDING;
                        break;
                    case SortedListDirection.DESCENDING:
                        name = this._body.getDelegate().bodyDefaultSortPredicateForModels(this._body);
                        direction = this._body.getDelegate().bodyDefaultSortDirectionForModels(this._body);
                        break;
                    default:
                        direction = SortedListDirection.ASCENDING;
                        break;
                }
            }
            else {
                direction = TSCore.Data.SortedListDirection.ASCENDING;
            }
            this.sort(name, direction);
        };
        Grid.prototype.remove = function () {
            this._header && this._header.remove.apply(this._header, arguments);
            this._body.remove.apply(this._body, arguments);
            _super.prototype.remove.call(this);
            return this;
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
            this.viewEvents = {
                "dragstart": "dragstart"
            };
            this.cols = new TSCore.Data.List();
            this.columns = columns;
            this.initialize();
        }
        Header.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            this.row = new TSGrid.HeaderRow(this.columns);
            this.columns.each(function (column) {
                column.events.on(TSGrid.ColumnEvents.CHANGED_WIDTH, function (e) { return _this.columnChangedWidth(e); });
            });
        };
        Header.prototype.columnChangedWidth = function (e) {
            var column = e.params.column;
            var columnIndex = this.columns.indexOf(column);
            var col = this.cols.get(columnIndex);
            if (col) {
                col.width(column.getWidth());
            }
        };
        Header.prototype.dragstart = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        Header.prototype.setGrid = function (grid) {
            this._grid = grid;
            return this;
        };
        Header.prototype.getGrid = function () {
            return this._grid;
        };
        Header.prototype.render = function () {
            var _this = this;
            var grid = this.getGrid();
            this.$table = $('<table />');
            this.$colgroup = $('<colgroup />');
            this.cols.clear();
            this.columns.each(function (column) {
                var $col = $('<col />');
                $col.css('width', column.getWidth());
                _this.$colgroup.append($col);
                _this.cols.add($col);
            });
            var $thead = $('<thead />');
            this.$table.append(this.$colgroup);
            this.$table.append($thead);
            $thead.append(this.row.render().$el);
            this.$table.attr('width', grid.getInnerWidth());
            this.$el.append(this.$table);
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
        function HeaderCell(column, model) {
            _super.call(this);
            this.tagName = 'th';
            this.viewEvents = {
                "mouseenter": "mouseenter",
                "mouseleave": "mouseleave",
                "click a": "click"
            };
            this.events = new TSCore.Events.EventEmitter();
            this.sortDirection = null;
            this.column = column;
            this.initialize();
        }
        HeaderCell.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            this.column.events.on(TSGrid.ColumnEvents.CHANGED_WIDTH, function (e) { return _this.columnChangedWidth(e); });
        };
        HeaderCell.prototype.columnChangedWidth = function (e) {
            this.render();
        };
        HeaderCell.prototype.click = function () {
            this.events.trigger(TSGrid.HeaderCellEvents.CLICK, { headerCell: this });
        };
        HeaderCell.prototype.mouseenter = function () {
            this.events.trigger(TSGrid.HeaderCellEvents.MOUSEENTER, { headerCell: this });
        };
        HeaderCell.prototype.mouseleave = function () {
            this.events.trigger(TSGrid.HeaderCellEvents.MOUSELEAVE, { headerCell: this });
        };
        HeaderCell.prototype.setSortDirection = function (direction) {
            if (this.sortDirection !== direction) {
                this.sortDirection = direction;
                this.render();
            }
        };
        HeaderCell.prototype.render = function () {
            this.$el.empty();
            var $label;
            if (this.column.getDescription()) {
                this.$el.append('<div class="th-description">' + this.column.getDescription() + '</div>');
            }
            if (this.column.getSortable()) {
                $label = $('<a href="javascript:void(0)">' + this.column.getTitle() + '</a>');
            }
            else {
                $label = document.createTextNode(this.column.getTitle());
            }
            this.$el.append($label);
            this.$el.removeClass('asc');
            this.$el.removeClass('desc');
            if (this.sortDirection === TSCore.Data.SortedListDirection.ASCENDING) {
                this.$el.addClass('asc');
            }
            if (this.sortDirection === TSCore.Data.SortedListDirection.DESCENDING) {
                this.$el.addClass('desc');
            }
            this.$el.addClass(this.column.getClassName());
            if (this.column.getSortable()) {
                this.$el.addClass('sortable');
            }
            this.delegateEvents();
            return this;
        };
        return HeaderCell;
    })(TSCore.App.UI.View);
    TSGrid.HeaderCell = HeaderCell;
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var HeaderCellEvents;
    (function (HeaderCellEvents) {
        HeaderCellEvents.CLICK = 'click';
        HeaderCellEvents.MOUSEENTER = 'mouseenter';
        HeaderCellEvents.MOUSELEAVE = 'mouseleave';
    })(HeaderCellEvents = TSGrid.HeaderCellEvents || (TSGrid.HeaderCellEvents = {}));
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var Row = (function (_super) {
        __extends(Row, _super);
        function Row(columns, model) {
            _super.call(this);
            this.tagName = 'tr';
            this.events = new TSCore.Events.EventEmitter();
            this.valid = false;
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
        Row.prototype.setLoading = function (loading) {
            this._loading = loading;
            if (this._loading) {
                this.$el.addClass('loading');
            }
            else {
                this.$el.removeClass('loading');
            }
        };
        Row.prototype.setActive = function (active) {
            this._active = active;
            if (this._active) {
                this.$el.addClass('active');
            }
            else {
                this.$el.removeClass('active');
            }
        };
        Row.prototype.setModel = function (model) {
            if (!model)
                return;
            this.model = model;
            this.modelId = model.getId();
            return this;
        };
        Row.prototype.makeCell = function (column) {
            var _this = this;
            var cellType = column.getCellType();
            var cell = new cellType(column, this.model);
            cell.events.on(TSGrid.CellEvents.CHANGED, function (e) { return _this.cellDidChange(e); });
            cell.events.on(TSGrid.CellEvents.CLEARED, function (e) { return _this.cellDidClear(e); });
            return cell;
        };
        Row.prototype.cellDidChange = function (e) {
            this.events.trigger(TSGrid.RowEvents.CHANGED, { row: this });
            this.render();
        };
        Row.prototype.cellDidClear = function (e) {
            this.render();
        };
        Row.prototype.render = function () {
            this.$el.empty();
            var fragment = document.createDocumentFragment();
            this.cells.each(function (cell) {
                cell.validationEnabled(true);
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
        function HeaderRow(columns) {
            _super.call(this);
            this.tagName = 'tr';
            this.columns = columns;
            this.cells = new TSCore.Data.List();
            this.initialize();
        }
        HeaderRow.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            this.columns.each(function (column) {
                _this.cells.add(_this.makeCell(column));
            });
        };
        HeaderRow.prototype.makeCell = function (column) {
            var headerCell = column.getHeaderType();
            return new headerCell(column);
        };
        HeaderRow.prototype.render = function () {
            this.$el.empty();
            var fragment = document.createDocumentFragment();
            this.cells.each(function (cell) {
                fragment.appendChild(cell.render().el);
            });
            this.el.appendChild(fragment);
            this.delegateEvents();
            return this;
        };
        return HeaderRow;
    })(TSCore.App.UI.View);
    TSGrid.HeaderRow = HeaderRow;
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var RowEvents;
    (function (RowEvents) {
        RowEvents.CHANGED = 'row:changed';
    })(RowEvents = TSGrid.RowEvents || (TSGrid.RowEvents = {}));
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
        TSGridEvents.REFRESH = "tsGrid:refresh";
        TSGridEvents.SORT = "tsGrid:sort";
        TSGridEvents.EDIT = "tsGrid:edit";
        TSGridEvents.EDITING = "tsGrid:editing";
        TSGridEvents.EDITED = "tsGrid:edited";
        TSGridEvents.ERROR = "tsGrid:error";
        TSGridEvents.NEXT = "tsGrid:next";
        TSGridEvents.NAVIGATE = "tsGrid:navigate";
        TSGridEvents.CHANGED_WIDTH = "tsGrid:changedWidth";
        TSGridEvents.CLICK = "tsGrid:click";
    })(TSGridEvents = TSGrid.TSGridEvents || (TSGrid.TSGridEvents = {}));
})(TSGrid || (TSGrid = {}));
//# sourceMappingURL=ts-grid.js.map