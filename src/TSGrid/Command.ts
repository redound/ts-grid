///<reference path="CommandTypes.ts"/>

module TSGrid {

    export class Command {

        public static ALLOWED_INPUT = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 167, 177, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 91, 92, 93, 94, 95, 96, 97, 98, 99, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90];

        public commandType:CommandTypes;

        public event;

        public type;

        public altKey;

        public char;

        public charCode;

        public ctrlKey:boolean;

        public key:string;

        public keyCode:number;

        public local:string;

        public location:string;

        public metaKey:boolean;

        public repeat:boolean;

        public shiftKey:boolean;

        public which:number;

        public setType(type: CommandTypes) {
            this.commandType = type;
        }

        public setEvent(evt:any) {

            this.event = evt;

            this.type = evt.type;
            this.ctrlKey = !!evt.ctrlKey;
            this.keyCode = evt.keyCode;
            this.shiftKey = !!evt.shiftKey;

            switch(true) {

                case (this.keyCode === 38):
                    this.commandType = CommandTypes.ARROW_UP;
                    break;

                case (this.keyCode === 40):
                    this.commandType = CommandTypes.ARROW_DOWN;
                    break;

                case (this.shiftKey && this.keyCode === 9):
                    this.commandType = CommandTypes.SHIFT_TAB;
                    break;

                case (this.keyCode === 37):
                    this.commandType = CommandTypes.ARROW_LEFT;
                    break;

                case (!this.shiftKey && this.keyCode === 9):
                    this.commandType = CommandTypes.TAB;
                    break;

                case (this.keyCode === 39):
                    this.commandType = CommandTypes.ARROW_RIGHT;
                    break;

                case (!this.shiftKey && this.keyCode === 13):
                    this.commandType = CommandTypes.ENTER;
                    break;

                case (this.keyCode === 8):
                    this.commandType = CommandTypes.BACKSPACE;
                    break;

                case (this.keyCode === 27):
                    this.commandType = CommandTypes.CANCEL;
                    break;

                default:
                    this.commandType = CommandTypes.NONE;
                    break;
            }
        }

        public getEvent() {
            return this.event;
        }

        public blurred() {
            return this.type === "blur";
        }

        public submitted() {
            return this.type === "submit";
        }

        public clicked() {
            return this.type === "click";
        }

        public arrowUp() {
            return this.commandType === CommandTypes.ARROW_UP;
        }

        public arrowDown() {
            return this.commandType === CommandTypes.ARROW_DOWN;
        }

        public arrowLeft() {
            return this.commandType === CommandTypes.ARROW_LEFT;
        }

        public arrowRight() {
            return this.commandType === CommandTypes.ARROW_RIGHT;
        }

        public shiftTab() {
            return this.commandType === CommandTypes.SHIFT_TAB;
        }

        public tab() {
            return this.commandType === CommandTypes.TAB;
        }

        /**
         * Alias for arrowUp
         * @returns {boolean}
         */
        public moveUp() {
            return this.arrowUp();
        }

        /**
         * Alias for arrowDown
         * @returns {boolean}
         */
        public moveDown() {
            return this.arrowDown();
        }

        /**
         * Alias for arrowLeft, shiftTab
         * @returns {boolean}
         */
        public moveLeft() {
            return (this.arrowLeft() || this.shiftTab());
        }

        /**
         * Alias for arrowRight, tab
         * @returns {boolean}
         */
        public moveRight() {
            return (this.arrowRight() || this.tab());
        }

        public enter() {
            return this.commandType === CommandTypes.ENTER;
        }

        public backspace() {
            return this.commandType === CommandTypes.BACKSPACE;
        }

        public cancel() {
            return this.commandType === CommandTypes.CANCEL;
        }

        public navigate() {
            return (this.moveUp() || this.moveDown() || this.moveLeft() || this.moveRight());
        }

        public navigateWhileEdit() {
            return (this.navigate() && !this.arrowLeft() && !this.arrowRight());
        }

        public input() {
            return Command.ALLOWED_INPUT.indexOf(this.keyCode) !== -1;
        }

        /**
         None of the above.
         @member TSGrid.Command
         */
        public passThru() {
            return !(this.navigate() || this.enter() || this.cancel());
        }

        public static fromEvent(evt: any) {
            var command = new Command();
            command.setEvent(evt);
            return command;
        }

        public static fromType(type: CommandTypes) {
            var command = new Command();
            command.setType(type);
            return command;
        }

        public static fromAction(action: CellEditorAction) {
            var command = new Command();
            switch(action) {
                case CellEditorAction.BLUR:
                    command.setType(CommandTypes.CANCEL);
                    break;
                case CellEditorAction.ESC:
                    command.setType(CommandTypes.CANCEL);
                    break;
                case CellEditorAction.ENTER:
                    command.setType(CommandTypes.ENTER);
                    break;
                default:
                    break;
            }
            return command;
        }
    }
}