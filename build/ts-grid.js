var TSGrid;
(function (TSGrid) {
    var View = (function () {
        function View() {
            this.tagName = 'div';
            this.attributes = {};
            this.cid = _.uniqueId('view');
        }
        View.prototype.$ = function (selector) {
            return this.$el.find(selector);
        };
        View.prototype.initialize = function () {
            this._ensureElement();
        };
        View.prototype.render = function () {
            return this;
        };
        View.prototype.remove = function () {
            this._removeElement();
            return this;
        };
        View.prototype._removeElement = function () {
            this.$el.remove();
        };
        View.prototype.setElement = function (element) {
            this.undelegateEvents();
            this._setElement(element);
            this.delegateEvents();
            return this;
        };
        View.prototype._setElement = function (el) {
            this.$el = $(el);
            this.el = this.$el[0];
        };
        View.prototype.delegateEvents = function (events) {
            events || (events = _.result(this, 'viewEvents'));
            if (!events)
                return this;
            this.undelegateEvents();
            for (var key in events) {
                var method = events[key];
                if (!_.isFunction(method))
                    method = this[method];
                if (!method)
                    continue;
                var match = key.match(View.DELEGATE_EVENT_SPLITTER);
                this.delegate(match[1], match[2], _.bind(method, this));
            }
            return this;
        };
        View.prototype.delegate = function (eventName, selector, listener) {
            this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
            return this;
        };
        View.prototype.undelegateEvents = function () {
            if (this.$el)
                this.$el.off('.delegateEvents' + this.cid);
            return this;
        };
        View.prototype.undelegate = function (eventName, selector, listener) {
            this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
            return this;
        };
        View.prototype._createElement = function (tagName) {
            return document.createElement(tagName);
        };
        View.prototype._ensureElement = function () {
            if (!this.el) {
                var attrs = _.extend({}, _.result(this, 'attributes'));
                if (this.id)
                    attrs.id = _.result(this, 'id');
                if (this.className)
                    attrs['class'] = _.result(this, 'className');
                this.setElement(this._createElement(_.result(this, 'tagName')));
                this._setAttributes(attrs);
            }
            else {
                this.setElement(_.result(this, 'el'));
            }
        };
        View.prototype._setAttributes = function (attributes) {
            this.$el.attr(attributes);
        };
        View.DELEGATE_EVENT_SPLITTER = /^(\S+)\s*(.*)$/;
        return View;
    })();
    TSGrid.View = View;
})(TSGrid || (TSGrid = {}));
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
///<reference path="CommandTypes.ts"/>
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
            if (evt) {
                _.extend(this, {
                    type: evt.type,
                    altKey: !!evt.altKey,
                    "char": evt["char"],
                    charCode: evt.charCode,
                    ctrlKey: !!evt.ctrlKey,
                    key: evt.key,
                    keyCode: evt.keyCode,
                    locale: evt.locale,
                    location: evt.location,
                    metaKey: !!evt.metaKey,
                    repeat: !!evt.repeat,
                    shiftKey: !!evt.shiftKey,
                    which: evt.which
                });
            }
            if (this.keyCode === 38) {
                this.commandType = TSGrid.CommandTypes.ARROW_UP;
            }
            else if (this.keyCode === 40) {
                this.commandType = TSGrid.CommandTypes.ARROW_DOWN;
            }
            else if (this.shiftKey && this.keyCode === 9) {
                this.commandType = TSGrid.CommandTypes.SHIFT_TAB;
            }
            else if (this.keyCode === 37) {
                this.commandType = TSGrid.CommandTypes.ARROW_LEFT;
            }
            else if (!this.shiftKey && this.keyCode === 9) {
                this.commandType = TSGrid.CommandTypes.TAB;
            }
            else if (this.keyCode === 39) {
                this.commandType = TSGrid.CommandTypes.ARROW_RIGHT;
            }
            else if (!this.shiftKey && this.keyCode === 13) {
                this.commandType = TSGrid.CommandTypes.ENTER;
            }
            else if (this.keyCode === 8) {
                this.commandType = TSGrid.CommandTypes.BACKSPACE;
            }
            else if (this.keyCode === 27) {
                this.commandType = TSGrid.CommandTypes.CANCEL;
            }
            else {
                this.commandType = TSGrid.CommandTypes.NONE;
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
        Command.ALLOWED_INPUT = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 167, 177, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 91, 92, 93, 94, 95, 96, 97, 98, 99];
        return Command;
    })();
    TSGrid.Command = Command;
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var GridPosition = (function () {
        function GridPosition(rowIndex, columnIndex) {
            this.rowIndex = rowIndex;
            this.columnIndex = columnIndex;
        }
        GridPosition.prototype.maxRowIndex = function (max) {
            this.rowIndex = Math.min(max, Math.max(0, this.rowIndex));
        };
        GridPosition.prototype.maxColumnIndex = function (max) {
            this.columnIndex = Math.min(max, Math.max(0, this.columnIndex));
        };
        GridPosition.prototype.same = function (gridPosition) {
            return (gridPosition.rowIndex === this.rowIndex && gridPosition.columnIndex === this.columnIndex);
        };
        return GridPosition;
    })();
    TSGrid.GridPosition = GridPosition;
})(TSGrid || (TSGrid = {}));
///<reference path="View.ts"/>
///<reference path="Command.ts"/>
///<reference path="CommandTypes.ts"/>
///<reference path="GridPosition.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSGrid;
(function (TSGrid) {
    var Body = (function (_super) {
        __extends(Body, _super);
        function Body(columns, items, rowClass) {
            _super.call(this);
            this.tagName = 'div';
            this.className = 'ts-grid-body';
            this.row = TSGrid.Row;
            this.columns = columns;
            this.items = items;
            this.row = rowClass;
            this.initialize();
        }
        Body.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            var grid = this.getGrid();
            this.rows = this.items.map(function (model) {
                return new _this.row(_this.columns, model);
            });
            this.items.events.on(TSCore.Data.List.Events.ADD, function (evt) { return _this.insertRows(evt); });
            this.items.events.on(TSCore.Data.List.Events.REMOVE, function (evt) { return _this.removeRows(evt); });
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
                this.items.add(model);
                return;
            }
            var row = new this.row(this.columns, model);
            var index = items.indexOf(model);
            this.rows.insert(row, index);
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
            _.each(operations, function (operation) {
                _this.insertRow(operation.item, operation.index, _this.items);
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
            this.items.remove(model);
            return this;
        };
        Body.prototype.refresh = function () {
        };
        Body.prototype.render = function () {
            this.$el.empty();
            var table = document.createElement('table');
            var tbody = document.createElement('tbody');
            table.appendChild(tbody);
            this.rows.each(function (row) {
                tbody.appendChild(row.render().el);
            });
            this.el.appendChild(table);
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
            console.log('moveToNextCell', evt);
            var grid = this.getGrid();
            var model = evt.params.model;
            var column = evt.params.column;
            var command = evt.params.command;
            var cell, renderable, editable, m, n;
            var i = this.items.indexOf(model);
            var j = this.columns.indexOf(column);
            if (j === -1)
                return this;
            var currentCell = this.rows.get(i).cells.get(j);
            if (command.navigate() || command.blurred()) {
                var l = this.columns.length;
                var maxOffset = l * this.items.length;
                if (command.blurred()) {
                    console.debug('BLURRED');
                    currentCell.blur();
                }
                else if (command.moveUp() || command.moveDown()) {
                    m = i + (command.moveUp() ? -1 : 1);
                    console.debug('MOVEUP MOVEDOWN');
                    var row = this.rows.get(m);
                    if (row) {
                        cell = row.cells.get(j);
                        if (TSGrid.callByNeed(cell.column.getEditable(), cell.column, model)) {
                            var editMode = currentCell.editModeActive;
                            currentCell.blur();
                            cell.focus();
                            if (editMode) {
                                cell.enterEditMode();
                            }
                            model.events.trigger(TSGrid.TSGridEvents.NEXT, {
                                m: m,
                                j: j,
                                b: false
                            });
                        }
                    }
                    else {
                        model.events.trigger(TSGrid.TSGridEvents.NEXT, {
                            m: m,
                            j: j,
                            b: true
                        });
                    }
                }
                else if (command.moveLeft() || command.moveRight()) {
                    console.debug('MOVELEFT MOVERIGHT');
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
                            currentCell.blur();
                            cell.focus();
                            if (editMode) {
                                cell.enterEditMode();
                            }
                            model.events.trigger(TSGrid.TSGridEvents.NEXT, {
                                m: m,
                                j: n,
                                b: false
                            });
                            break;
                        }
                    }
                    if (offset == maxOffset) {
                        model.events.trigger(TSGrid.TSGridEvents.NEXT, {
                            m: ~~(offset / l),
                            j: offset - m * l,
                            b: true
                        });
                    }
                }
            }
            return this;
        };
        Body.prototype.reset = function () {
        };
        return Body;
    })(TSGrid.View);
    TSGrid.Body = Body;
})(TSGrid || (TSGrid = {}));
///<reference path="View.ts"/>
var TSGrid;
(function (TSGrid) {
    var Cell = (function (_super) {
        __extends(Cell, _super);
        function Cell(column, model) {
            _super.call(this);
            this.tagName = 'td';
            this.editModeActive = false;
            this.focussed = false;
            this.viewEvents = {
                "click": "click",
                "blur": "blur",
                "keypress": "processKeypress",
                "keydown": "processKeydown"
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
            var value = formatter ? formatter(modelValue) : modelValue;
            this.$el.text(value);
            this.delegateEvents();
            return this;
        };
        Cell.prototype.processKeypress = function (evt) {
            var command = TSGrid.Command.fromEvent(evt);
            if (command.input()) {
                var char = String.fromCharCode(evt.keyCode);
                this.enterEditMode(false, char);
            }
        };
        Cell.prototype.processKeydown = function (evt) {
            var command = TSGrid.Command.fromEvent(evt);
            if (command.enter()) {
                this.enterEditMode();
            }
            if (command.backspace()) {
                console.log('is backspace');
                evt.preventDefault();
                this.clear();
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
            if (this.focussed) {
                this.enterEditMode();
            }
            else {
                this.focus();
            }
        };
        Cell.prototype.focus = function () {
            this.focussed = true;
            this.$el.attr('tabindex', 0);
            this.$el.focus();
            this.$el.addClass('active');
            console.log('focus cell', this.model.get("title"));
        };
        Cell.prototype.blur = function () {
            if (this.editModeActive) {
                this.exitEditMode();
            }
            this.focussed = false;
            console.log('blur cell', this.model.get("title"));
            this.$el.removeClass('active');
            this.$el.removeAttr('tabindex');
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
                this.focus();
            }
        };
        Cell.prototype.enterEditMode = function (selectAll, initialValue) {
            var _this = this;
            if (selectAll === void 0) { selectAll = true; }
            var editable = TSGrid.callByNeed(this.column.getEditable(), this.column, this.model);
            if (editable) {
                var editorFactory = this.column.getEditor();
                this.currentEditor = editorFactory(this.column, this.model);
                console.log('editor!', this.currentEditor);
                this.model.events.trigger(TSGrid.TSGridEvents.EDIT, {
                    model: this.model,
                    column: this.column,
                    cell: this,
                    editor: this.currentEditor
                });
                this.undelegateEvents();
                if (initialValue) {
                    this.currentEditor.setValue(initialValue);
                }
                this.currentEditor.render();
                setTimeout(function () {
                    _this.$el.empty();
                    _this.$el.append(_this.currentEditor.$el);
                    _this.$el.addClass('editor');
                    _this.currentEditor.$el.focus();
                    if (selectAll) {
                        _this.currentEditor.$el.select();
                    }
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
    })(TSGrid.View);
    TSGrid.Cell = Cell;
})(TSGrid || (TSGrid = {}));
///<reference path="View.ts"/>
var TSGrid;
(function (TSGrid) {
    var CellEditor = (function (_super) {
        __extends(CellEditor, _super);
        function CellEditor(column, model) {
            _super.call(this);
            this.scope = new TSCore.Data.Dictionary();
            this.column = column;
            this.model = model;
        }
        CellEditor.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
        };
        CellEditor.prototype.setValue = function (value) {
            this.value = value;
        };
        CellEditor.prototype.scopeValue = function (key, value) {
            this.scope.set(key, value);
            return this;
        };
        CellEditor.prototype.saveOrCancel = function (evt, command) {
            if (!command) {
                command = TSGrid.Command.fromEvent(evt);
            }
            var model = this.model;
            var column = this.column;
            var grid = column.getGrid();
            if (command.navigateWhileEdit() || command.enter() || command.clicked() || command.submitted() || command.blurred()) {
                console.log('saveOrCancel', evt);
                if (evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                }
                var newValue = this.$scope.vm.model;
                model.set(column.getName(), newValue);
                var editedEvent = {
                    model: model,
                    column: column,
                    command: command
                };
                grid.events.trigger(TSGrid.TSGridEvents.EDITED, editedEvent);
                model.events.trigger(TSGrid.TSGridEvents.EDITED, editedEvent);
            }
            else if (command.cancel()) {
                if (evt) {
                    evt.stopPropagation();
                }
                var editedEvent = {
                    model: model,
                    column: column,
                    command: command
                };
                grid.events.trigger(TSGrid.TSGridEvents.EDITED, editedEvent);
                model.events.trigger(TSGrid.TSGridEvents.EDITED, editedEvent);
            }
        };
        CellEditor.prototype.compile = function ($el) {
            this.destroyScope();
            var $injector = angular.element(document).injector();
            var $compile = $injector.get('$compile');
            var $rootScope = $injector.get('$rootScope');
            this.$scope = $rootScope.$new();
            this.scope.set('model', !_.isUndefined(this.value) ? this.value : this.model.get(this.column.getName()));
            this.scope.set('editor', this);
            this.$scope.vm = this.scope.toObject();
            return $compile($el)(this.$scope);
        };
        CellEditor.prototype.postRender = function (evt) {
            var column = evt.params.column;
            if (column == null || column.getId() == this.column.getId()) {
                this.$el.focus();
            }
            return this;
        };
        CellEditor.prototype.destroyScope = function () {
            if (this.$scope) {
                this.$scope.$destroy();
                delete this.$scope;
            }
        };
        CellEditor.prototype.remove = function () {
            this.destroyScope();
            _super.prototype.remove.call(this);
            return this;
        };
        return CellEditor;
    })(TSGrid.View);
    TSGrid.CellEditor = CellEditor;
})(TSGrid || (TSGrid = {}));
///<reference path="Cell.ts"/>
var TSGrid;
(function (TSGrid) {
    var Column = (function () {
        function Column() {
            this._renderable = true;
            this._editable = false;
            this._uniqId = parseInt(_.uniqueId());
        }
        Column.prototype.getId = function () {
            return this._uniqId;
        };
        Column.prototype.setGrid = function (grid) {
            this._grid = grid;
        };
        Column.prototype.getGrid = function () {
            return this._grid;
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
///<reference path="View.ts"/>
var TSGrid;
(function (TSGrid) {
    var Row = (function (_super) {
        __extends(Row, _super);
        function Row(columns, model) {
            _super.call(this);
            this.tagName = 'tr';
            this.columns = columns;
            this.model = model;
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
        Row.prototype.makeCell = function (column) {
            return new TSGrid.Cell(column, this.model);
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
    })(TSGrid.View);
    TSGrid.Row = Row;
})(TSGrid || (TSGrid = {}));
///<reference path="Row.ts"/>
var TSGrid;
(function (TSGrid) {
    var FocusableRow = (function (_super) {
        __extends(FocusableRow, _super);
        function FocusableRow() {
            _super.apply(this, arguments);
            this.highlightColor = '#F5F5F5';
            this.viewEvents = {
                "focusin": "rowFocused",
                "focusout": "rowLostFocus"
            };
        }
        FocusableRow.prototype.rowFocused = function () {
            if (this.removeHighlightTimeout) {
                clearTimeout(this.removeHighlightTimeout);
            }
            this.$el.css('backgroundColor', this.highlightColor);
        };
        FocusableRow.prototype.rowLostFocus = function () {
            var _this = this;
            this.removeHighlightTimeout = setTimeout(function () {
                _this.$el.css('backgroundColor', 'initial');
                _this.removeHighlightTimeout = null;
            }, 40);
        };
        return FocusableRow;
    })(TSGrid.Row);
    TSGrid.FocusableRow = FocusableRow;
})(TSGrid || (TSGrid = {}));
///<reference path="View.ts"/>
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
        };
        Grid.prototype.getHeader = function () {
            return this._header;
        };
        Grid.prototype.setBody = function (body) {
            body.setGrid(this);
            this._body = body;
        };
        Grid.prototype.getBody = function () {
            return this._body;
        };
        Grid.prototype.setColumns = function (columns) {
            var _this = this;
            columns.each(function (column) {
                column.setGrid(_this);
            });
            this._columns = columns;
        };
        Grid.prototype.getColumns = function () {
            return this._columns;
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
    })(TSGrid.View);
    TSGrid.Grid = Grid;
})(TSGrid || (TSGrid = {}));
///<reference path="View.ts"/>
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
        };
        Header.prototype.getGrid = function () {
            return this._grid;
        };
        Header.prototype.render = function () {
            var table = document.createElement('table');
            table.appendChild(this.row.render().el);
            this.el.appendChild(table);
            this.delegateEvents();
            return this;
        };
        Header.prototype.reset = function () {
        };
        return Header;
    })(TSGrid.View);
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
                "click a": "onClick"
            };
            this.column = column;
            this.initialize();
        }
        HeaderCell.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
        };
        HeaderCell.prototype.render = function () {
            this.$el.empty();
            var label = document.createTextNode(this.column.getLabel());
            this.$el.append(label);
            this.$el.addClass(this.column.getName());
            this.delegateEvents();
            return this;
        };
        return HeaderCell;
    })(TSGrid.View);
    TSGrid.HeaderCell = HeaderCell;
})(TSGrid || (TSGrid = {}));
///<reference path="Row.ts"/>
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
///<reference path="CellEditor.ts"/>
var TSGrid;
(function (TSGrid) {
    var InputCellEditor = (function (_super) {
        __extends(InputCellEditor, _super);
        function InputCellEditor(column, model) {
            _super.call(this, column, model);
            this.tagName = 'input';
            this.attributes = {
                "type": "text"
            };
            this.viewEvents = {
                "blur": "saveOrCancel",
                "keydown": "saveOrCancel"
            };
            this.initialize();
        }
        InputCellEditor.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
        };
        InputCellEditor.prototype.render = function () {
            this.$el.attr('ng-model', "vm.model");
            this.compile(this.$el);
            return this;
        };
        return InputCellEditor;
    })(TSGrid.CellEditor);
    TSGrid.InputCellEditor = InputCellEditor;
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
///<reference path="CellEditor.ts"/>
var TSGrid;
(function (TSGrid) {
    var TextCellEditor = (function (_super) {
        __extends(TextCellEditor, _super);
        function TextCellEditor(column, model) {
            _super.call(this, column, model);
            this.tagName = 'div';
            this.viewEvents = {
                "blur": "saveOrCancel",
                "keydown": "saveOrCancel"
            };
            this.initialize();
        }
        TextCellEditor.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
        };
        TextCellEditor.prototype.render = function () {
            this.$el.attr('text-cell-editor', "vm.model");
            this.$el.attr('cell-editor', "vm.editor");
            this.compile(this.$el);
            return this;
        };
        return TextCellEditor;
    })(TSGrid.CellEditor);
    TSGrid.TextCellEditor = TextCellEditor;
})(TSGrid || (TSGrid = {}));
///<reference path="CellEditor.ts"/>
var TSGrid;
(function (TSGrid) {
    var TypeaheadCellEditor = (function (_super) {
        __extends(TypeaheadCellEditor, _super);
        function TypeaheadCellEditor(column, model) {
            _super.call(this, column, model);
            this.tagName = 'input';
            this.attributes = {
                "type": "text"
            };
            this.viewEvents = {
                "blur": "saveOrCancel",
                "keydown": "saveOrCancel"
            };
            this.initialize();
        }
        TypeaheadCellEditor.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
        };
        TypeaheadCellEditor.prototype.saveOrCancel = function (evt) {
            var command = TSGrid.Command.fromEvent(evt);
            if (this.typeaheadOpened()) {
                return;
            }
            _super.prototype.saveOrCancel.call(this, evt);
        };
        TypeaheadCellEditor.prototype.openTypehead = function () {
            this.$scope.vm.opened = true;
        };
        TypeaheadCellEditor.prototype.typeaheadOpened = function () {
            return this.$scope.vm.opened;
        };
        TypeaheadCellEditor.prototype.onSelect = function ($item, $model, $label, $event) {
            console.log('onSelect', $item, $model, $label, $event);
            this.saveOrCancel($event);
        };
        TypeaheadCellEditor.prototype.render = function () {
            this.scope.set('opened', true);
            this.scope.set('onSelect', _.bind(this.onSelect, this));
            this.$el.attr({
                "uib-typeahead": "option for option in vm.options | filter:$viewValue | limitTo:8",
                "typeahead-min-length": 0,
                "typeahead-show-hint": true,
                "typeahead-is-open": "vm.opened",
                "typeahead-append-to-body": false,
                "typeahead-on-select": "vm.onSelect($item, $model, $label, $event)",
                "ng-model": "vm.model"
            });
            this.$el.addClass('form-control');
            this.compile(this.$el);
            return this;
        };
        return TypeaheadCellEditor;
    })(TSGrid.CellEditor);
    TSGrid.TypeaheadCellEditor = TypeaheadCellEditor;
})(TSGrid || (TSGrid = {}));
/// <reference path="../../ts-core/build/ts-core.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="TSGrid/Body.ts" />
/// <reference path="TSGrid/Cell.ts" />
/// <reference path="TSGrid/CellEditor.ts" />
/// <reference path="TSGrid/Column.ts" />
/// <reference path="TSGrid/Command.ts" />
/// <reference path="TSGrid/CommandTypes.ts" />
/// <reference path="TSGrid/FocusableRow.ts" />
/// <reference path="TSGrid/Grid.ts" />
/// <reference path="TSGrid/GridPosition.ts" />
/// <reference path="TSGrid/Header.ts" />
/// <reference path="TSGrid/HeaderCell.ts" />
/// <reference path="TSGrid/HeaderRow.ts" />
/// <reference path="TSGrid/InputCellEditor.ts" />
/// <reference path="TSGrid/Row.ts" />
/// <reference path="TSGrid/TSGrid.ts" />
/// <reference path="TSGrid/TextCellEditor.ts" />
/// <reference path="TSGrid/TypeaheadCellEditor.ts" />
/// <reference path="TSGrid/View.ts" />
//# sourceMappingURL=ts-grid.js.map