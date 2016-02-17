module TSGrid {

    export class HeaderCell extends View {

        public tagName: string = 'th';

        public viewEvents: any = {
            "click a": "onClick"
        };

        public row: HeaderRow;

        public column: Column;

        public constructor(column: Column) {

            super();

            this.column = column;

            this.initialize();
        }

        public initialize() {

            super.initialize();

            // TODO: Implement.
        }

        public render() {

            this.$el.empty();

            var label = document.createTextNode(this.column.getLabel());

            this.$el.append(label);
            this.$el.addClass(this.column.getName());
            this.$el.attr('width', this.column.getWidth());
            this.delegateEvents();

            return this;
        }
    }
}