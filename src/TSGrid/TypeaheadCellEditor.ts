///<reference path="CellEditor.ts"/>

module TSGrid {

    export class TypeaheadCellEditor extends CellEditor {

        public tagName: string = 'input';

        public attributes: any = {
            "type": "text"
        };

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

        public saveOrCancel(evt) {

            var command = Command.fromEvent(evt);

            if (this.typeaheadOpened()) {
                return;
            }

            super.saveOrCancel(evt);
        }

        public openTypehead() {
            this.$scope.vm.opened = true;
        }

        public typeaheadOpened() {
            return this.$scope.vm.opened;
        }

        public onSelect($item, $model, $label, $event) {

            console.log('onSelect', $item, $model, $label, $event);
            this.saveOrCancel($event);
        }

        public render() {

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
        }
    }
}
