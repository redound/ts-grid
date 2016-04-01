"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SortedList_1 = require("ts-core/lib/Data/SortedList");
var View_1 = require("./View");
var List_1 = require("ts-core/lib/Data/List");
var Dictionary_1 = require("ts-core/lib/Data/Dictionary");
var Collection_1 = require("ts-core/lib/Data/Collection");
var EventEmitter_1 = require("ts-core/lib/Events/EventEmitter");
var Column_1 = require("./Column");
var Row_1 = require("./Row");
var Grid_1 = require("./Grid");
var utils_1 = require("./utils");
var _ = require("underscore");
var $ = require("jquery");
exports.BODY_EVENTS = {
    CHANGED_ROW: 'body:changedRow',
    CHANGED_CELL: 'body:changedCell'
};
var Body = (function (_super) {
    __extends(Body, _super);
    function Body(delegate, columns, collection, rowType) {
        if (rowType === void 0) { rowType = Row_1.default; }
        _super.call(this);
        this.tagName = 'div';
        this.className = 'ts-grid-body';
        this.cols = new List_1.default();
        this.rowType = Row_1.default;
        this.rowsByModelId = new Dictionary_1.default();
        this.events = new EventEmitter_1.default();
        this._delegate = delegate;
        this.columns = columns;
        this.collection = collection;
        this.rowType = rowType;
        this.initialize();
    }
    Body.prototype.initialize = function () {
        var _this = this;
        _super.prototype.initialize.call(this);
        this.rows = new List_1.default();
        var models = this.collection.all();
        this.models = new SortedList_1.default(models, this._delegate.bodyPrimaryKeyForModels(this));
        this.models.setSortPredicate(this._delegate.bodyDefaultSortPredicateForModels(this), this._delegate.bodyDefaultSortDirectionForModels(this));
        this.rowsByModelId.clear();
        this.models.each(function (model) {
            var row = new _this.rowType(_this.columns, model);
            _this.rowsByModelId.set(model.getId(), row);
            _this.rows.add(row);
        });
        this.collection.events.on(Collection_1.CollectionEvents.ADD, function (evt) { return _this.addModels(evt); });
        this.collection.events.on(Collection_1.CollectionEvents.REMOVE, function (evt) { return _this.removeModels(evt); });
        this.models.events.on(SortedList_1.SortedListEvents.ADD, function (evt) { return _this.addRows(evt); });
        this.models.events.on(SortedList_1.SortedListEvents.REMOVE, function (evt) { return _this.removeRows(evt); });
        this.models.events.on(SortedList_1.SortedListEvents.SORT, function (evt) { return _this.sortRows(evt); });
        this.columns.each(function (column) {
            column.events.on(Column_1.COLUMN_EVENTS.CHANGED_WIDTH, function (e) { return _this.columnChangedWidth(e); });
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
        grid.events.on(Grid_1.GRID_EVENTS.EDITED, this.moveToNextCell, this);
        grid.events.on(Grid_1.GRID_EVENTS.NAVIGATE, this.moveToNextCell, this);
        grid.events.on(Grid_1.GRID_EVENTS.CLICK, this.moveToCell, this);
    };
    Body.prototype.getGrid = function () {
        return this._grid;
    };
    Body.prototype.prependEmptyRow = function () {
        var _this = this;
        this.emptyRow = new this.rowType(this.columns, this._delegate.bodyModelForEmptyRow(this));
        this.emptyRow.events.on(Row_1.ROW_EVENTS.CHANGED, function (e) { return _this.emptyRowDidChange(e); });
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
        this.rows = new List_1.default();
        this.rowsByModelId.clear();
        this.models.each(function (model) {
            var row = new _this.rowType(_this.columns, model);
            _this.rowsByModelId.set(model.getId(), row);
            _this.rows.add(row);
        });
        this.render();
        grid.events.trigger(Grid_1.GRID_EVENTS.REFRESH, { body: this });
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
        this.events.trigger(exports.BODY_EVENTS.CHANGED_ROW, { fromRow: fromRow, toRow: toRow });
    };
    Body.prototype.focusEmptyRow = function () {
        this.activeRow = null;
        this.activeCell = null;
        var row = this.rows.get(0);
        var cell = row.cells.get(0);
        this.activate(row, cell);
    };
    Body.prototype.changedCell = function (fromCell, toCell) {
        this.events.trigger(exports.BODY_EVENTS.CHANGED_CELL, { fromCell: fromCell, toCell: toCell });
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
                    if (utils_1.callByNeed(cell.column.getEditable(), cell.column, model)) {
                        this.activate(row, cell);
                        grid.events.trigger(Grid_1.GRID_EVENTS.NEXT, {
                            row: m,
                            column: j,
                            outside: false
                        });
                    }
                }
                else {
                    grid.events.trigger(Grid_1.GRID_EVENTS.NEXT, {
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
                    renderable = utils_1.callByNeed(cell.column.getRenderable(), cell.column, cell.model);
                    editable = utils_1.callByNeed(cell.column.getEditable(), cell.column, model);
                    if (renderable && editable) {
                        this.activate(row, cell);
                        grid.events.trigger(Grid_1.GRID_EVENTS.NEXT, {
                            row: m,
                            column: n,
                            outside: false
                        });
                        break;
                    }
                }
                if (offset == maxOffset) {
                    grid.events.trigger(Grid_1.GRID_EVENTS.NEXT, {
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
}(View_1.default));
exports.Body = Body;
