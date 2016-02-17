///<reference path="CellEditor.ts"/>

module TSGrid {

    export class TextCellEditor extends CellEditor {

        public tagName: string = 'div';

        public viewEvents: any = {
            "blur": "saveOrCancel",
            "keydown": "saveOrCancel"
        };

        public constructor(column: Column, model: TSCore.Data.Model) {

            super(column, model);

            this.initialize();
        }

        public initialize() {

            super.initialize();
        }

        public render() {

            this.$el.attr('text-cell-editor', "vm.model");
            this.$el.attr('cell-editor', "vm.editor");
            this.compile(this.$el);

            return this;
        }
    }
}
