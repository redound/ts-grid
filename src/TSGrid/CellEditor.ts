///<reference path="View.ts"/>

module TSGrid {

    export interface ICellEditor {
        new (column: Column, model: TSCore.Data.Model): CellEditor;
    }

    export class CellEditor extends View {

        public column: Column;

        public model: TSCore.Data.Model;

        public scope: TSCore.Data.Dictionary<string, any> = new TSCore.Data.Dictionary<string, any>();

        public $scope;

        public value: any;

        public constructor(column: Column, model: TSCore.Data.Model) {

            super();

            this.column = column;
            this.model = model;
        }

        public initialize() {

            super.initialize();
        }

        public setValue(value: any) {
            this.value = value;
        }

        public scopeValue(key: string, value: any): CellEditor {
            this.scope.set(key, value);
            return this;
        }

        public saveOrCancel(evt, command?: Command) {

            if (!command) {
                command = Command.fromEvent(evt);
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

                grid.events.trigger(TSGridEvents.EDITED, editedEvent);
                model.events.trigger(TSGridEvents.EDITED, editedEvent);
            }
            // esc
            else if (command.cancel()) {

                // undo
                if (evt) {
                    evt.stopPropagation();
                }

                var editedEvent = {
                    model: model,
                    column: column,
                    command: command
                };

                grid.events.trigger(TSGridEvents.EDITED, editedEvent);
                model.events.trigger(TSGridEvents.EDITED, editedEvent);
            }
        }

        public compile($el: JQuery) {

            this.destroyScope();

            var $injector = angular.element(document).injector();

            var $compile = $injector.get('$compile');
            var $rootScope = $injector.get('$rootScope');

            this.$scope = $rootScope.$new();
            this.scope.set('model', !_.isUndefined(this.value) ? this.value : this.model.get(this.column.getName()));
            this.scope.set('editor', this);

            this.$scope.vm = this.scope.toObject();

            return $compile($el)(this.$scope);
        }

        public postRender(evt) {

            var column = evt.params.column;

            if (column == null || column.getId() == this.column.getId()) {
                this.$el.focus();
            }

            return this;
        }

        public destroyScope() {

            if (this.$scope) {
                this.$scope.$destroy();
                delete this.$scope;
            }
        }

        public remove() {

            this.destroyScope();
            super.remove();
            return this;
        }
    }
}
