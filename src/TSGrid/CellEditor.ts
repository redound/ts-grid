module TSGrid {

    export interface ICellEditor {
        new (column: Column, model: TSCore.Data.Model): CellEditor;
    }

    export enum CellEditorAction {
        ESC,
        BLUR,
        ENTER
    }

    export class CellEditor extends TSCore.App.UI.View {

        protected column: Column;

        protected model: TSCore.Data.Model;

        protected editorName: string;

        protected initialModelValue: any;

        public constructor(column: Column, model: TSCore.Data.Model, editorName: string) {
            super();
            this.setColumn(column);
            this.setModel(model);
            this.setEditorName(editorName);
            this.initialize();
        }

        /**
         * Set the column.
         * @param column
         * @returns {TSGrid.CellEditor}
         * @chainable
         */
        public setColumn(column: Column): this {
            this.column = column;
            return this;
        }

        /**
         * Get the column.
         * @returns {Column}
         */
        public getColumn(): Column {
            return this.column;
        }

        /**
         * Set the model.
         * @param model
         * @returns {TSGrid.CellEditor}
         * @chainable
         */
        public setModel(model: TSCore.Data.Model): this {
            this.model = model;
            return this;
        }

        /**
         * Get the model.
         * @returns {TSCore.Data.Model}
         */
        public getModel(): TSCore.Data.Model {
            return this.model;
        }

        /**
         * Set the editorName.
         * @param editorName
         * @returns {TSGrid.CellEditor}
         * @chainable
         */
        public setEditorName(editorName: string): this {
            this.editorName = editorName;
            return this;
        }

        /**
         * Get the editorName.
         * @returns {string}
         */
        public getEditorName(): string {
            return this.editorName;
        }

        /**
         * Set the initialModelValue.
         * @param value
         * @chainable
         */
        public setInitialModelValue(value: any): this {
            this.initialModelValue = value;
            return this;
        }

        /**
         * Get the initialModelValue.
         * @returns {any}
         */
        public getInitialModelValue(): any {
            return this.initialModelValue;
        }

        /**
         * Set the modelValue.
         * @param value
         * @returns {TSGrid.CellEditor}
         * @chainable
         */
        public setModelValue(value: any) {

            var setter = this.column.getSetter();

            if (setter) {
                setter(this.model, value);
            } else {
                this.model.set(this.column.getName(), value);
            }

            return this;
        }

        /**
         * Get the modelValue.
         * @returns {*|any}
         */
        public getModelValue(): any {

            var getter = this.column.getGetter();

            if (getter) {
                return getter(this.model);
            }

            return this.model.get(this.column.getName());
        }

        /**
         * Set's the updated modelValue, than triggers
         * TSGridEvents.EDITED event on the grid and model.
         *
         * @param action Action on which the save action is based.
         * @param value The updated modelValue
         */
        public save(action: CellEditorAction, value: any) {

            var model = this.model;
            var column = this.column;
            var grid = column.getGrid();

            this.setModelValue(value);

            var editedEvent = {
                model: model,
                column: column,
                command: Command.fromAction(action),
            };

            grid.events.trigger(TSGridEvents.EDITED, editedEvent);
            model.events.trigger(TSGridEvents.EDITED, editedEvent);
        }

        /**
         * Cancel editing.
         *
         * @param action Action on which the cancel action is based.
         */
        public cancel(action: CellEditorAction) {

            var model = this.model;
            var column = this.column;
            var grid = column.getGrid();

            var editedEvent = {
                model: model,
                column: column,
                command: Command.fromAction(action)
            };

            grid.events.trigger(TSGridEvents.EDITED, editedEvent);
            model.events.trigger(TSGridEvents.EDITED, editedEvent);
        }
    }
}
