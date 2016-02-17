///<reference path="View.ts"/>

module TSGrid {

    export interface ICell {
        new (column: Column, model: TSCore.Data.Model): Cell;
    }

    export class Cell extends View {

        public tagName: string = 'td';

        public editModeActive: boolean = false;

        public focussed: boolean = false;

        public currentEditor: CellEditor;

        public viewEvents = {
            "click": "click",
            "blur": "blur",
            "keypress": "processKeypress",
            "keydown": "processKeydown"
        };

        public column: Column;

        public model: TSCore.Data.Model;

        public constructor(column: Column, model: TSCore.Data.Model) {

            super();

            this.column = column;

            this.model = model;

            this.initialize();
        }

        public initialize() {

            super.initialize();

            this.model.events.on(TSGridEvents.EDITED, this.doneEditing, this);

            if (TSGrid.callByNeed(this.column.getEditable(), this.column, this.model)) this.$el.addClass("editable");
            if (TSGrid.callByNeed(this.column.getRenderable(), this.column, this.model)) this.$el.addClass("renderable");
        }

        public render(): Cell {
            this.$el.empty();
            var formatter = this.column.getFormatter();
            var modelValue = this.model.get(this.column.getName());
            var value = formatter ? formatter(modelValue) : modelValue;
            this.$el.text(value);
            this.delegateEvents();
            return this;
        }

        public processKeypress(evt) {

            var command = Command.fromEvent(evt);

            if (command.input()) {

                var char = String.fromCharCode(evt.keyCode);
                this.enterEditMode(false, char);
            }
        }

        public processKeydown(evt) {

            var command = Command.fromEvent(evt);

            if (command.enter()) {

                this.enterEditMode();
            }

            if (command.backspace()) {

                evt.preventDefault();
                this.clear();
            }

            if (command.navigate()) {

                var grid = this.column.getGrid();
                grid.events.trigger(TSGridEvents.NAVIGATE, {
                    column: this.column,
                    model: this.model,
                    command: command
                });
            }
        }

        public click() {

            if (this.focussed) {
                this.enterEditMode();
            } else {
                this.focus();
            }
        }

        public focus() {

            this.focussed = true;
            this.$el.attr('tabindex', 0);
            this.$el.focus();
            this.$el.addClass('active');
        }

        public blur() {

            if (this.editModeActive) {
                this.exitEditMode();
            }

            this.focussed = false;
            this.$el.removeClass('active');
            this.$el.removeAttr('tabindex');
        }

        public clear() {

            this.model.set(this.column.getName(), null);
            this.render();
        }

        public doneEditing(evt) {

            var column = evt.params.column;
            var command = evt.params.command;

            if ((command.enter() || command.submitted() || command.cancel()) && (column == null || column.getId() == this.column.getId())) {

                if (this.editModeActive) {
                    this.exitEditMode();
                }

                this.focus();
            }
        }

        public enterEditMode(selectAll = true, initialValue?: any) {

            var editable = TSGrid.callByNeed(this.column.getEditable(), this.column, this.model);

            if (editable) {

                var editorFactory = this.column.getEditor();

                this.currentEditor = editorFactory(
                    this.column,
                    this.model
                );

                this.model.events.trigger(TSGridEvents.EDIT, {
                    model: this.model,
                    column: this.column,
                    cell: this,
                    editor: this.currentEditor
                });

                // Need to redundantly undelegate events for Firefox
                this.undelegateEvents();

                if (initialValue) {
                    this.currentEditor.setValue(initialValue);
                }

                this.currentEditor.autoFocus();

                if (selectAll) {
                    this.currentEditor.selectAll();
                }

                this.currentEditor.render();

                setTimeout(() => {

                    this.$el.empty();
                    this.$el.append(this.currentEditor.$el);
                    this.$el.addClass('editor');
                    this.$el.addClass(this.currentEditor.getEditorName());

                }, 10);

                this.editModeActive = true;

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

            this.editModeActive = false;
            this.$el.removeClass("error");
            this.$el.removeClass(this.currentEditor.getEditorName());
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
