///<reference path="Grid.ts"/>
///<reference path="Cell.ts"/>

module TSGrid {

    export class HeaderCell extends TSCore.App.UI.View {

        public tagName: string = 'th';

        public viewEvents: any = {
            "mouseenter": "mouseenter",
            "mouseleave": "mouseleave",
            "click a": "click"
        };

        public row: HeaderRow;

        public column: Column;

        public events: TSCore.Events.EventEmitter = new TSCore.Events.EventEmitter();

        protected sortDirection: TSCore.Data.SortedListDirection = null;

        public constructor(column: Column, model: TSCore.App.Data.Model.ActiveModel) {

            super();

            this.column = column;

            this.initialize();
        }

        public initialize() {
            super.initialize();

            this.column.events.on(TSGrid.ColumnEvents.CHANGED_WIDTH, e => this.columnChangedWidth(e));
        }

        protected columnChangedWidth(e) {

            this.render();
        }

        protected click() {

            this.events.trigger(HeaderCellEvents.CLICK, { headerCell: this });
        }

        protected mouseenter() {

            this.events.trigger(HeaderCellEvents.MOUSEENTER, { headerCell: this });
        }

        protected mouseleave() {

            this.events.trigger(HeaderCellEvents.MOUSELEAVE, { headerCell: this });
        }

        public setSortDirection(direction: TSCore.Data.SortedListDirection) {

            if (this.sortDirection !== direction) {
                this.sortDirection = direction;
                this.render();
            }
        }

        public render(): this {

            this.$el.empty();

            var $label;

            if (this.column.getSortable()) {
                $label = $('<a href="javascript:void(0)">' + this.column.getTitle() + '</a>');
            } else {
                $label = document.createTextNode(this.column.getTitle());
            }

            this.$el.removeClass('asc');
            this.$el.removeClass('desc');

            if (this.sortDirection === TSCore.Data.SortedListDirection.ASCENDING) {
                this.$el.addClass('asc');
            }

            if (this.sortDirection === TSCore.Data.SortedListDirection.DESCENDING) {
                this.$el.addClass('desc');
            }

            this.$el.append($label);
            this.$el.addClass(this.column.getClassName());
            if (this.column.getSortable()) {
                this.$el.addClass('sortable');
            }

            this.delegateEvents();

            return this;
        }
    }
}