///<reference path="View.ts"/>

module TSGrid {

    export interface ICellEditor {
        new (column: Column, model: TSCore.Data.Model, formatter: CellFormatter): CellEditor;
    }

    export class CellEditor extends View {

        public column: Column;

        public model: TSCore.Data.Model;

        public formatter: CellFormatter;

        public editScope;

        public value: any;

        public constructor(column: Column, model: TSCore.Data.Model, formatter: CellFormatter) {

            super();

            this.column = column;
            this.model = model;
            this.formatter = formatter;
        }

        public initialize() {

            super.initialize();

            this.model.events.on(TSGridEvents.EDITING, this.postRender, this);
        }

        public setValue(value: any) {
            this.value = value;
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

                var newValue = this.editScope.vm.model;
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

            this.editScope = $rootScope.$new();
            this.editScope.vm = {
                model: !_.isUndefined(this.value) ? this.value : this.model.get(this.column.getName()),
                editor: this
            };

            return $compile($el)(this.editScope);
        }

        public postRender(evt) {

            var column = evt.params.column;

            if (column == null || column.getId() == this.column.getId()) {
                this.$el.focus();
            }

            return this;
        }

        public destroyScope() {

            if (this.editScope) {
                this.editScope.$destroy();
                delete this.editScope;
            }
        }

        public remove() {

            this.destroyScope();
            super.remove();
            return this;
        }
    }
}
