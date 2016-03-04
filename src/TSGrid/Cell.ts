module TSGrid {

    export interface ICell {
        new (column: Column, model: TSCore.Data.Model): Cell;
    }

    export class Cell extends TSCore.App.UI.View {

        public static CELL_INPUT = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 167, 177, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 91, 92, 93, 94, 95, 96, 97, 98, 99, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90];

        public tagName: string = 'td';

        public editModeActive: boolean = false;

        /**
         * Upon entering edit mode this property
         * contains an instance of CellEditor, when
         * exiting edit mode this instance get's removed again.
         */
        public currentEditor: CellEditor;

        public viewEvents = {
            "click": "click",
            "keypress": "keypress",
            "keydown": "keydown"
        };

        /**
         * Column cell belongs to.
         */
        public column: Column;

        /**
         * Model of the Row instance this cell
         * belongs to.
         */
        public model: TSCore.Data.Model;

        public activated: boolean = false;

        public constructor(column: Column, model: TSCore.Data.Model) {

            super();

            this.column = column;

            this.model = model;

            this.initialize();
        }

        /**
         * Initializer.
         *
         * If this cells column is marked as editable or renderable
         * this cell with get a corresponding class set for that.
         */
        public initialize() {

            super.initialize();

            if (TSGrid.callByNeed(this.column.getEditable(), this.column, this.model)) this.$el.addClass("editable");
            if (TSGrid.callByNeed(this.column.getRenderable(), this.column, this.model)) this.$el.addClass("renderable");
        }

        /**
         * This function is responsible for
         * rendering the element in display mode.
         *
         * By default the Model's value for this cell
         * is set as value.
         *
         * When a formatter is given
         * the value will first be formatted before being
         * set as value.
         *
         * Also, the width from the column definition
         * will be applied on this cell.
         * @returns {TSGrid.Cell}
         * @chainable
         */
        public render(): this {
            this.$el.empty();
            var formatter = this.column.getFormatter();
            var getter = this.column.getGetter();
            var modelValue = getter ? getter(this.model) : this.model.get(this.column.getName());
            var value = formatter ? formatter(this.model) : modelValue;
            this.$el.html(value);
            this.$el.attr('width', this.column.getWidth());
            this.$el.css('max-width', this.column.getWidth());
            var columnClassName = this.column.getClassName();
            if (columnClassName) {
                this.$el.addClass(columnClassName);
            }
            this.delegateEvents();
            return this;
        }

        /**
         * When valid cell input is entered,
         * we enter edit mode with that character
         * as the editors initial value.
         * @param evt
         */
        protected keypress(evt) {

            var cellInput = Cell.CELL_INPUT.indexOf(evt.keyCode) !== -1;

            if (this.column.getEditOnInput() && cellInput && !evt.metaKey && !evt.ctrlKey) {

                var char = String.fromCharCode(evt.keyCode);

                this.enterEditMode(char);
            }
        }

        /**
         * When ENTER gets hit we enter edit mode.
         *
         * When BACKSPACE gets hit we clear the Model's value.
         *
         * When the user uses the NAVIGATION keys,
         * we let the grid know we want to navigate in the grid.
         *
         * @param evt
         */
        protected keydown(evt) {

            var cmd = Command.fromEvent(evt);

            if (cmd.enter()) {

                this.enterEditMode();
            }

            if (cmd.backspace()) {

                evt.preventDefault();

                if (this.column.getAllowClear()) {
                    this.clear();
                }
            }

            if (cmd.left() || cmd.right() || cmd.up() || cmd.down() || cmd.shiftTab() || cmd.tab()) {

                evt.preventDefault();

                var grid = this.column.getGrid();
                grid.events.trigger(TSGridEvents.NAVIGATE, {
                    column: this.column,
                    model: this.model,
                    command: cmd
                });
            }
        }

        /**
         * When CLICKED while cell isn't focused activate cell.
         *
         * When CLICKED while cell IS focused enter edit mode.
         */
        protected click(event) {

            var grid = this.column.getGrid();

            grid.events.trigger(TSGridEvents.CLICK, {
                column: this.column,
                model: this.model,
                event: event
            });
        }

        /**
         * On BLUR remove corresponding classes, attributes and
         * exit edit mode if needed.
         */
        protected blur() {

            this.$el.removeClass('active');
            this.$el.removeAttr('tabindex');
        }

        /**
         * Activate means focusing the cell and
         * adding the corresponding classes to the cell
         */
        public activate() {

            this.$el.attr('tabindex', 0);
            this.$el.addClass('active');
            this.$el.focus();
            this.activated = true;
        }

        public isActivated(): boolean {
            return this.activated;
        }

        /**
         * Deactivate cell
         */
        public deactivate() {

            if (this.editModeActive) {
                this.exitEditMode();
            }
            this.blur();
            this.activated = false;
        }

        /**
         * Clear Model's value and rerender cell with that value.
         */
        public clear() {

            var onClear = this.column.getOnClear();
            var setter = this.column.getSetter();

            if (onClear) {
                onClear(this.model);
            } else if (setter) {
                setter(this.model, null);
            } else {
                this.model.set(this.column.getName(), null);
            }

            this.render();
        }

        /**
         * If this column is editable, a new CellEditor instance is instantiated with
         * its required paramters. An `editor` together with a `editor-name` CSS class
         * is added to the cell upon entering edit mode.
         *
         *
         * This method triggers a TSGridEvents.EDIT event on the model when the cell
         * is entering edit mode and an editor instance has been constructed,
         * but before it is rendered and inserted into the DOM. The model, column, cell
         * and the constructed cell editor instance are sent as event parameters in the event.
         *
         * @param withModelValue Optional. A value can be passed to be used as the initial
         * value for the editor when it gets activated.
         */
        public enterEditMode(withModelValue?: any) {

            if (this.editModeActive) return;

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

                if (withModelValue) {
                    this.currentEditor.setInitialModelValue(withModelValue);
                }

                this.currentEditor.render();

                setTimeout(() => {

                    this.blur();
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
        public remove(): this {

            if (this.currentEditor) {
                this.currentEditor.remove.apply(this.currentEditor, arguments);
                delete this.currentEditor;
            }
            return this;
        }
    }
}
