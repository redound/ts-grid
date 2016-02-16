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

        public saveOrCancel(e, command?: Command) {

            var newValue = this.editScope.vm.model;

            var formatter = this.formatter;
            var model = this.model;
            var column = this.column;
            var grid = column.getGrid();

            if (!command) {
                command = Command.fromEvent(e);
            }

            if (command.clicked() || command.submitted() || command.moveUp() || command.moveDown() || command.moveLeft() || command.moveRight() ||
                command.save() || command.blurred()) {

                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                // Check validity
                if (false) {

                    var errorEvent = {
                        model: model,
                        column: column,
                        val: newValue
                    };

                    grid.events.trigger(TSGridEvents.ERROR, errorEvent);
                    model.events.trigger(TSGridEvents.ERROR, errorEvent);
                }
                else {
                    model.set(column.getName(), newValue);

                    var editedEvent = {
                        model: model,
                        column: column,
                        command: command
                    };

                    grid.events.trigger(TSGridEvents.EDITED, editedEvent);
                    model.events.trigger(TSGridEvents.EDITED, editedEvent);
                }
            }
            // esc
            else if (command.cancel()) {
                // undo

                if (e) {
                    e.stopPropagation();
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
                model: this.model.get(this.column.getName()),
                editor: this
            };

            return $compile($el)(this.editScope);
        }

        public postRender(evt) {

            var column = evt.params.column;

            if (column == null || column.getName() == this.column.getName()) {
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

        public activate() {
            this.$el.focus();
            this.$el.select();
        }
    }
}
