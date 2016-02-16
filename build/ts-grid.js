var TSGrid;
(function (TSGrid) {
    var Events = (function () {
        function Events() {
        }
        Events.prototype.listenTo = function (target, eventName, handler) {
        };
        Events.prototype.trigger = function (eventName, context) {
        };
        return Events;
    })();
    TSGrid.Events = Events;
})(TSGrid || (TSGrid = {}));
///<reference path="Events.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSGrid;
(function (TSGrid) {
    var View = (function (_super) {
        __extends(View, _super);
        function View() {
            _super.call(this);
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
    })(TSGrid.Events);
    TSGrid.View = View;
})(TSGrid || (TSGrid = {}));
///<reference path="View.ts"/>
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
            var model = evt.params.model;
            var column = evt.params.column;
            var command = evt.params.command;
            var cell, renderable, editable, m, n;
            var i = this.items.indexOf(model);
            var j = this.columns.indexOf(column);
            if (j === -1)
                return this;
            this.rows.get(i).cells.get(j).exitEditMode();
            if (command.moveUp() || command.moveDown() || command.moveLeft() ||
                command.moveRight() || command.save()) {
                var l = this.columns.length;
                var maxOffset = l * this.items.length;
                if (command.moveUp() || command.moveDown()) {
                    m = i + (command.moveUp() ? -1 : 1);
                    var row = this.rows.get(m);
                    if (row) {
                        cell = row.cells.get(j);
                        if (TSGrid.callByNeed(cell.column.getEditable(), cell.column, model)) {
                            cell.enterEditMode();
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
                    var right = command.moveRight();
                    for (var offset = i * l + j + (right ? 1 : -1); offset >= 0 && offset < maxOffset; right ? offset++ : offset--) {
                        m = ~~(offset / l);
                        n = offset - m * l;
                        cell = this.rows.get(m).cells.get(n);
                        renderable = TSGrid.callByNeed(cell.column.getRenderable(), cell.column, cell.model);
                        editable = TSGrid.callByNeed(cell.column.getEditable(), cell.column, model);
                        if (renderable && editable) {
                            cell.enterEditMode();
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
        function Cell(column, model, editor, formatter) {
            _super.call(this);
            this.tagName = 'td';
            this.editor = TSGrid.InputCellEditor;
            this.viewEvents = {
                "click": "enterEditMode"
            };
            this.column = column;
            this.model = model;
            this.editor = TSGrid.resolveNameToClass(this.editor, "CellEditor");
            if (formatter) {
                this.formatter = new formatter();
            }
            else {
                this.formatter = new TSGrid.StringFormatter();
            }
            this.initialize();
        }
        Cell.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            if (TSGrid.callByNeed(this.column.getEditable(), this.column, this.model))
                this.$el.addClass("editable");
            if (TSGrid.callByNeed(this.column.getRenderable(), this.column, this.model))
                this.$el.addClass("renderable");
        };
        Cell.prototype.render = function () {
            this.$el.empty();
            this.$el.text(this.formatter.fromRaw(this.model.get(this.column.getName()), this.model));
            this.delegateEvents();
            return this;
        };
        Cell.prototype.enterEditMode = function () {
            var _this = this;
            var editable = TSGrid.callByNeed(this.column.getEditable(), this.column, this.model);
            if (editable) {
                this.currentEditor = new this.editor(this.column, this.model, this.formatter);
                this.model.events.trigger(TSGrid.TSGridEvents.EDIT, {
                    model: this.model,
                    column: this.column,
                    cell: this,
                    editor: this.currentEditor
                });
                this.undelegateEvents();
                this.currentEditor.render();
                setTimeout(function () {
                    _this.$el.empty();
                    _this.$el.append(_this.currentEditor.$el);
                    _this.$el.addClass('editor');
                    _this.currentEditor.activate();
                }, 10);
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
        function CellEditor(column, model, formatter) {
            _super.call(this);
            this.column = column;
            this.model = model;
            this.formatter = formatter;
        }
        CellEditor.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.model.events.on(TSGrid.TSGridEvents.EDITING, this.postRender, this);
        };
        CellEditor.prototype.saveOrCancel = function (e, command) {
            var newValue = this.editScope.vm.model;
            var formatter = this.formatter;
            var model = this.model;
            var column = this.column;
            var grid = column.getGrid();
            if (!command) {
                command = TSGrid.Command.fromEvent(e);
            }
            if (command.clicked() || command.submitted() || command.moveUp() || command.moveDown() || command.moveLeft() || command.moveRight() ||
                command.save() || command.blurred()) {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (false) {
                    var errorEvent = {
                        model: model,
                        column: column,
                        val: newValue
                    };
                    grid.events.trigger(TSGrid.TSGridEvents.ERROR, errorEvent);
                    model.events.trigger(TSGrid.TSGridEvents.ERROR, errorEvent);
                }
                else {
                    model.set(column.getName(), newValue);
                    var editedEvent = {
                        model: model,
                        column: column,
                        command: command
                    };
                    grid.events.trigger(TSGrid.TSGridEvents.EDITED, editedEvent);
                    model.events.trigger(TSGrid.TSGridEvents.EDITED, editedEvent);
                }
            }
            else if (command.cancel()) {
                if (e) {
                    e.stopPropagation();
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
            this.editScope = $rootScope.$new();
            this.editScope.vm = {
                model: this.model.get(this.column.getName()),
                editor: this
            };
            return $compile($el)(this.editScope);
        };
        CellEditor.prototype.postRender = function (evt) {
            var column = evt.params.column;
            if (column == null || column.getName() == this.column.getName()) {
                this.$el.focus();
            }
            return this;
        };
        CellEditor.prototype.destroyScope = function () {
            if (this.editScope) {
                this.editScope.$destroy();
                delete this.editScope;
            }
        };
        CellEditor.prototype.remove = function () {
            this.destroyScope();
            _super.prototype.remove.call(this);
            return this;
        };
        CellEditor.prototype.activate = function () {
            this.$el.focus();
            this.$el.select();
        };
        return CellEditor;
    })(TSGrid.View);
    TSGrid.CellEditor = CellEditor;
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var CellFormatter = (function (_super) {
        __extends(CellFormatter, _super);
        function CellFormatter() {
            _super.apply(this, arguments);
        }
        CellFormatter.prototype.fromRaw = function (rawData, model) {
            return rawData;
        };
        CellFormatter.prototype.toRaw = function (formattedData, model) {
            return formattedData;
        };
        return CellFormatter;
    })(TSCore.BaseObject);
    TSGrid.CellFormatter = CellFormatter;
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    var Column = (function () {
        function Column() {
            this._renderable = true;
            this._editable = false;
        }
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
        Column.prototype.cell = function (cell) {
            this._cell = cell;
            return this;
        };
        Column.prototype.getCell = function () {
            return this._cell;
        };
        Column.prototype.getCellClass = function () {
            return TSGrid.resolveNameToClass(this._cell + '-cell');
        };
        Column.prototype.getHeaderCellClass = function () {
            return TSGrid.resolveNameToClass('header-cell');
        };
        Column.prototype.formatter = function (formatter) {
            this._formatter = formatter;
            return this;
        };
        Column.prototype.getFormatter = function () {
            return this._formatter;
        };
        Column.prototype.getFormatterClass = function () {
            return TSGrid.resolveNameToClass('string-formatter');
        };
        return Column;
    })();
    TSGrid.Column = Column;
})(TSGrid || (TSGrid = {}));
var TSGrid;
(function (TSGrid) {
    (function (CommandTypes) {
        CommandTypes[CommandTypes["NONE"] = 0] = "NONE";
        CommandTypes[CommandTypes["MOVE_UP"] = 1] = "MOVE_UP";
        CommandTypes[CommandTypes["MOVE_DOWN"] = 2] = "MOVE_DOWN";
        CommandTypes[CommandTypes["MOVE_LEFT"] = 3] = "MOVE_LEFT";
        CommandTypes[CommandTypes["MOVE_RIGHT"] = 4] = "MOVE_RIGHT";
        CommandTypes[CommandTypes["SAVE"] = 5] = "SAVE";
        CommandTypes[CommandTypes["CANCEL"] = 6] = "CANCEL";
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
                this.commandType = TSGrid.CommandTypes.MOVE_UP;
            }
            else if (this.keyCode === 40) {
                this.commandType = TSGrid.CommandTypes.MOVE_DOWN;
            }
            else if (this.shiftKey && this.keyCode === 9) {
                this.commandType = TSGrid.CommandTypes.MOVE_LEFT;
            }
            else if (!this.shiftKey && this.keyCode === 9) {
                this.commandType = TSGrid.CommandTypes.MOVE_RIGHT;
            }
            else if (!this.shiftKey && this.keyCode === 13) {
                this.commandType = TSGrid.CommandTypes.SAVE;
            }
            else if (this.keyCode === 27) {
                this.commandType = TSGrid.CommandTypes.CANCEL;
            }
            else {
                this.commandType = TSGrid.CommandTypes.NONE;
            }
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
        Command.prototype.moveUp = function () {
            return this.commandType === TSGrid.CommandTypes.MOVE_UP;
        };
        Command.prototype.moveDown = function () {
            return this.commandType === TSGrid.CommandTypes.MOVE_DOWN;
        };
        Command.prototype.moveLeft = function () {
            return this.commandType === TSGrid.CommandTypes.MOVE_LEFT;
        };
        Command.prototype.moveRight = function () {
            return this.commandType === TSGrid.CommandTypes.MOVE_RIGHT;
        };
        Command.prototype.save = function () {
            return this.commandType === TSGrid.CommandTypes.SAVE;
        };
        Command.prototype.cancel = function () {
            return this.commandType === TSGrid.CommandTypes.CANCEL;
        };
        Command.prototype.passThru = function () {
            return !(this.moveUp() || this.moveDown() || this.moveLeft() ||
                this.moveRight() || this.save() || this.cancel());
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
        return Command;
    })();
    TSGrid.Command = Command;
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
            var cell = column.getCellClass();
            return new cell(column, this.model);
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
        Grid.prototype.insertColumn = function () { };
        Grid.prototype.removeColumn = function () { };
        Grid.prototype.render = function () {
            this.$el.empty();
            if (this._header) {
                this.$el.append(this._header.render().$el);
            }
            this.$el.append(this._body.render().$el);
            this.delegateEvents();
            this.trigger(TSGrid.TSGridEvents.RENDERED, this);
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
            var headerCell = column.getHeaderCellClass();
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
        function InputCellEditor(column, model, formatter) {
            _super.call(this, column, model, formatter);
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
///<reference path="View.ts"/>
var TSGrid;
(function (TSGrid) {
    var NumberCell = (function (_super) {
        __extends(NumberCell, _super);
        function NumberCell(column, model, editor, formatter) {
            _super.call(this, column, model, editor, formatter);
            this.className = 'number-cell';
            this.decimals = TSGrid.NumberFormatter.defaults.decimals;
            this.decimalSeparator = TSGrid.NumberFormatter.defaults.decimalSeparator;
            this.orderSeparator = TSGrid.NumberFormatter.defaults.orderSeparator;
        }
        NumberCell.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
        };
        return NumberCell;
    })(TSGrid.Cell);
    TSGrid.NumberCell = NumberCell;
})(TSGrid || (TSGrid = {}));
///<reference path="NumberCell.ts"/>
var TSGrid;
(function (TSGrid) {
    var IntegerCell = (function (_super) {
        __extends(IntegerCell, _super);
        function IntegerCell() {
            _super.apply(this, arguments);
            this.className = 'integer-cell';
            this.decimals = 0;
        }
        return IntegerCell;
    })(TSGrid.NumberCell);
    TSGrid.IntegerCell = IntegerCell;
})(TSGrid || (TSGrid = {}));
///<reference path="CellFormatter.ts"/>
var TSGrid;
(function (TSGrid) {
    var NumberFormatter = (function (_super) {
        __extends(NumberFormatter, _super);
        function NumberFormatter(options) {
            _super.call(this);
            this.decimalSeparator = '.';
            this.orderSeparator = ',';
            _.extend(this, this.static.defaults, options || {});
            if (this.decimals < 0 || this.decimals > 20) {
                throw new RangeError("decimals must be between 0 and 20");
            }
        }
        NumberFormatter.prototype.fromRaw = function (number, model) {
            if (_.isNull(number) || _.isUndefined(number))
                return '';
            var fixedNumber = number.toFixed(~~this.decimals);
            var parts = fixedNumber.split('.');
            var integerPart = parts[0];
            var decimalPart = parts[1] ? (this.decimalSeparator || '.') + parts[1] : '';
            return integerPart.replace(this.static.HUMANIZED_NUM_RE, '$1' + this.orderSeparator) + decimalPart;
        };
        NumberFormatter.prototype.toRaw = function (formattedData, model) {
            formattedData = formattedData.trim();
            if (formattedData === '')
                return null;
            var rawData = '';
            var thousands = formattedData.split(this.orderSeparator);
            for (var i = 0; i < thousands.length; i++) {
                rawData += thousands[i];
            }
            var decimalParts = rawData.split(this.decimalSeparator);
            rawData = '';
            for (var i = 0; i < decimalParts.length; i++) {
                rawData = rawData + decimalParts[i] + '.';
            }
            if (rawData[rawData.length - 1] === '.') {
                rawData = rawData.slice(0, rawData.length - 1);
            }
            var rawDataNumber = parseFloat(rawData);
            var result = rawDataNumber.toFixed(~~this.decimals);
            if (_.isNumber(result) && !_.isNaN(result))
                return result;
        };
        NumberFormatter.HUMANIZED_NUM_RE = /(\d)(?=(?:\d{3})+$)/g;
        NumberFormatter.defaults = {
            decimals: 0,
            decimalSeparator: '.',
            orderSeparator: ','
        };
        return NumberFormatter;
    })(TSGrid.CellFormatter);
    TSGrid.NumberFormatter = NumberFormatter;
})(TSGrid || (TSGrid = {}));
///<reference path="View.ts"/>
var TSGrid;
(function (TSGrid) {
    var StringCell = (function (_super) {
        __extends(StringCell, _super);
        function StringCell() {
            _super.apply(this, arguments);
            this.className = 'string-cell';
        }
        return StringCell;
    })(TSGrid.Cell);
    TSGrid.StringCell = StringCell;
})(TSGrid || (TSGrid = {}));
///<reference path="CellFormatter.ts"/>
var TSGrid;
(function (TSGrid) {
    var StringFormatter = (function (_super) {
        __extends(StringFormatter, _super);
        function StringFormatter() {
            _super.apply(this, arguments);
        }
        StringFormatter.prototype.fromRaw = function (rawValue, model) {
            if (_.isUndefined(rawValue) || _.isNull(rawValue))
                return '';
            return rawValue + '';
        };
        return StringFormatter;
    })(TSGrid.CellFormatter);
    TSGrid.StringFormatter = StringFormatter;
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
    })(TSGridEvents = TSGrid.TSGridEvents || (TSGrid.TSGridEvents = {}));
})(TSGrid || (TSGrid = {}));
///<reference path="View.ts"/>
var TSGrid;
(function (TSGrid) {
    var TextCell = (function (_super) {
        __extends(TextCell, _super);
        function TextCell() {
            _super.apply(this, arguments);
            this.className = 'text-cell';
            this.editor = TSGrid.TextCellEditor;
        }
        return TextCell;
    })(TSGrid.Cell);
    TSGrid.TextCell = TextCell;
})(TSGrid || (TSGrid = {}));
///<reference path="CellEditor.ts"/>
var TSGrid;
(function (TSGrid) {
    var TextCellEditor = (function (_super) {
        __extends(TextCellEditor, _super);
        function TextCellEditor(column, model, formatter) {
            _super.call(this, column, model, formatter);
            this.tagName = 'div';
            this.viewEvents = {
                "blur": "saveOrCancel",
                "keydown": "saveOrCancel"
            };
            this.initialize();
        }
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
/// <reference path="../../ts-core/build/ts-core.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="TSGrid/Body.ts" />
/// <reference path="TSGrid/Cell.ts" />
/// <reference path="TSGrid/CellEditor.ts" />
/// <reference path="TSGrid/CellFormatter.ts" />
/// <reference path="TSGrid/Column.ts" />
/// <reference path="TSGrid/Command.ts" />
/// <reference path="TSGrid/CommandTypes.ts" />
/// <reference path="TSGrid/Events.ts" />
/// <reference path="TSGrid/FocusableRow.ts" />
/// <reference path="TSGrid/Grid.ts" />
/// <reference path="TSGrid/Header.ts" />
/// <reference path="TSGrid/HeaderCell.ts" />
/// <reference path="TSGrid/HeaderRow.ts" />
/// <reference path="TSGrid/InputCellEditor.ts" />
/// <reference path="TSGrid/IntegerCell.ts" />
/// <reference path="TSGrid/NumberCell.ts" />
/// <reference path="TSGrid/NumberFormatter.ts" />
/// <reference path="TSGrid/Row.ts" />
/// <reference path="TSGrid/StringCell.ts" />
/// <reference path="TSGrid/StringFormatter.ts" />
/// <reference path="TSGrid/TSGrid.ts" />
/// <reference path="TSGrid/TextCell.ts" />
/// <reference path="TSGrid/TextCellEditor.ts" />
/// <reference path="TSGrid/View.ts" />
//# sourceMappingURL=ts-grid.js.map