///<reference path="View.ts"/>

module TSGrid {

    export interface ICellEditor {
        new (column: Column, model: TSCore.Data.Model): CellEditor;
    }

    export class CellEditor extends View {

        public column: Column;

        public model: TSCore.Data.Model;

        public editorName: string;

        public options: TSCore.Data.Dictionary<string, any> = new TSCore.Data.Dictionary<string, any>();

        public $scope;

        public value: any;

        protected _autoFocus: boolean = false;

        protected _selectAll: boolean = false;

        public constructor(column: Column, model: TSCore.Data.Model, editorName: string) {
            super();
            this.column = column;
            this.model = model;
            this.editorName = editorName;
            this.initialize();
        }

        public initialize() {
            super.initialize();
        }

        public autoFocus(): CellEditor {
            this._autoFocus = true;
            return this;
        }

        public shouldAutoFocus(): boolean {
            return this._autoFocus;
        }

        public selectAll(): CellEditor {
            this._selectAll = true;
            return this;
        }

        public shouldSelectAll(): boolean {
            return this._selectAll;
        }

        public setValue(value: any) {
            this.value = value;
        }

        public option(key: string, value: any): CellEditor {
            this.options.set(key, value);
            return this;
        }

        public save(commandType: CommandTypes, value: any) {

            var model = this.model;
            var column = this.column;
            var grid = column.getGrid();

            model.set(column.getName(), value);

            var editedEvent = {
                model: model,
                column: column,
                command: Command.fromType(commandType),
            };

            grid.events.trigger(TSGridEvents.EDITED, editedEvent);
            model.events.trigger(TSGridEvents.EDITED, editedEvent);
        }

        public cancel(commandType: CommandTypes) {

            var model = this.model;
            var column = this.column;
            var grid = column.getGrid();

            var editedEvent = {
                model: model,
                column: column,
                command: Command.fromType(commandType)
            };

            grid.events.trigger(TSGridEvents.EDITED, editedEvent);
            model.events.trigger(TSGridEvents.EDITED, editedEvent);
        }

        public render() {

            this.$el.attr(this.editorName, '');
            this.$el.attr('cell-editor-options', 'options');
            this.compile(this.$el);

            return this;
        }

        public compile($el: JQuery) {

            this.destroyScope();

            var $injector = angular.element(document).injector();

            var $compile = $injector.get('$compile');
            var $rootScope = $injector.get('$rootScope');

            this.$scope = $rootScope.$new();
            this.options.set('model', !_.isUndefined(this.value) ? this.value : this.model.get(this.column.getName()));
            this.options.set('editor', this);

            this.$scope.options = this.options.toObject();

            return $compile($el)(this.$scope);
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
