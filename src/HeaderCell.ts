import View from "./View";
import HeaderRow from "./HeaderRow";
import Column, {COLUMN_EVENTS} from "./Column";
import EventEmitter from "ts-core/lib/Events/EventEmitter";
import {SortedListDirection} from "ts-core/lib/Data/SortedList";

export const HEADER_CELL_EVENTS = {
    CLICK: 'headerCell:click',
    MOUSEENTER: 'headerCell:mouseenter',
    MOUSELEAVE: 'headerCell:mouseleave'
};

export interface HeaderCellInterface {
    new (column:Column):HeaderCell;
}


export default class HeaderCell extends View {

    public tagName:string = 'th';

    public viewEvents:any = {
        "mouseenter": "mouseenter",
        "mouseleave": "mouseleave",
        "click a": "click"
    };

    public row:HeaderRow;

    public column:Column;

    public events:EventEmitter = new EventEmitter();

    protected sortDirection:SortedListDirection = null;

    public constructor(column:Column) {

        super();

        this.column = column;

        this.initialize();
    }

    public initialize() {
        super.initialize();

        this.column.events.on(COLUMN_EVENTS.CHANGED_WIDTH, e => this.columnChangedWidth(e));
    }

    protected columnChangedWidth(e) {

        this.render();
    }

    protected click() {

        this.events.trigger(HEADER_CELL_EVENTS.CLICK, {headerCell: this});
    }

    protected mouseenter() {

        this.events.trigger(HEADER_CELL_EVENTS.MOUSEENTER, {headerCell: this});
    }

    protected mouseleave() {

        this.events.trigger(HEADER_CELL_EVENTS.MOUSELEAVE, {headerCell: this});
    }

    public setSortDirection(direction:SortedListDirection) {

        if (this.sortDirection !== direction) {
            this.sortDirection = direction;
            this.render();
        }
    }

    public render():this {

        this.$el.empty();

        var $label;

        if (this.column.getDescription()) {
            this.$el.append('<div class="th-description">' + this.column.getDescription() + '</div>');
        }

        if (this.column.getSortable()) {
            $label = $('<a href="javascript:void(0)">' + this.column.getTitle() + '</a>');
        } else {
            $label = document.createTextNode(this.column.getTitle());
        }

        this.$el.append($label);


        this.$el.removeClass('asc');
        this.$el.removeClass('desc');

        if (this.sortDirection === SortedListDirection.ASCENDING) {
            this.$el.addClass('asc');
        }

        if (this.sortDirection === SortedListDirection.DESCENDING) {
            this.$el.addClass('desc');
        }

        this.$el.addClass(this.column.getClassName());
        if (this.column.getSortable()) {
            this.$el.addClass('sortable');
        }

        this.delegateEvents();

        return this;
    }
}
