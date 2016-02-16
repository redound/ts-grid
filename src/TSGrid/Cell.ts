///<reference path="View.ts"/>

module TSGrid {

    export interface ICell {
        new (column: Column, model: TSCore.Data.Model, editor?: ICellEditor, formatter?: CellFormatter): Cell;
    }

    export interface CellOptions {
        column?: Column
    }

    export class Cell extends View {

        public tagName: string = 'td';

        public formatter: CellFormatter;

        public editor: ICellEditor = InputCellEditor;

        public currentEditor: CellEditor;

        public viewEvents = {
            "click": "enterEditMode"
        };

        public column: Column;

        public model: TSCore.Data.Model;

        public constructor(column: Column, model: TSCore.Data.Model, editor?: ICellEditor, formatter?: ICellFormatter) {

            super();

            this.column = column;

            this.model = model;

            this.editor = TSGrid.resolveNameToClass<ICellEditor>(this.editor, "CellEditor");

            if (formatter) {
                this.formatter = new formatter();
            } else {
                this.formatter = new StringFormatter();
            }

            this.initialize();
        }

        public initialize() {

            super.initialize();

            if (TSGrid.callByNeed(this.column.getEditable(), this.column, this.model)) this.$el.addClass("editable");
            if (TSGrid.callByNeed(this.column.getRenderable(), this.column, this.model)) this.$el.addClass("renderable");
        }

        public render(): Cell {
            this.$el.empty();
            this.$el.text(this.formatter.fromRaw(this.model.get(this.column.getName()), this.model));
            this.delegateEvents();
            return this;
        }

        public enterEditMode() {

            var editable = TSGrid.callByNeed(this.column.getEditable(), this.column, this.model);

            if (editable) {

                this.currentEditor = new this.editor(
                    this.column,
                    this.model,
                    this.formatter
                );

                this.model.events.trigger(TSGridEvents.EDIT, {
                    model: this.model,
                    column: this.column,
                    cell: this,
                    editor: this.currentEditor
                });

                // Need to redundantly undelegate events for Firefox
                this.undelegateEvents();

                this.currentEditor.render();

                setTimeout(() => {

                    this.$el.empty();
                    this.$el.append(this.currentEditor.$el);
                    this.$el.addClass('editor');
                    this.currentEditor.activate();
                }, 10);

                this.model.events.trigger(TSGridEvents.EDITING, {
                    model: this.model,
                    column: this.column,
                    cell: this,
                    editor: this.currentEditor
                });
            }
        }

        /**
         * Put an `error` CSS class on the table cell.
         * @param model
         * @param column
         */
        public renderError(model: TSCore.Data.Model, column: Column) {
            if (column == null || column.getName() == this.column.getName()) {
                this.$el.addClass("error");
            }
        }

        /**
         * Removes the editor and re-render in display mode.
         */
        public exitEditMode() {

            this.$el.removeClass("error");
            this.currentEditor.remove();
            delete this.currentEditor;
            this.$el.removeClass("editor");
            this.render();
        }

        /**
         * Clean up this cell.
         *
         * @chainable
         */
        public remove(): Cell {
            if (this.currentEditor) {
                this.currentEditor.remove.apply(this.currentEditor, arguments);
                delete this.currentEditor;
            }
            return this;
        }
    }
}
