///<reference path="CellEditor.ts"/>

module TSGrid {

    export class InputCellEditor extends CellEditor {

        public tagName: string = 'input';

        public attributes: any = {
            "type": "text"
        };

        public viewEvents: any = {
            "blur": "saveOrCancel",
            "keydown": "saveOrCancel"
        };

        public constructor(column: Column, model: TSCore.Data.Model, formatter: CellFormatter) {

            super(column, model, formatter);

            this.initialize();
        }

        public initialize() {

            super.initialize();
        }

        public render() {

            this.$el.attr('ng-model', "vm.model");
            this.compile(this.$el);
            return this;
        }
    }
}
