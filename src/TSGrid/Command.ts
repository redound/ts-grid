///<reference path="CommandTypes.ts"/>

module TSGrid {

    import KeyCodes = TSCore.App.UI.KeyCodes;

    export class Command {

        protected _type:CommandTypes;

        public type(type: CommandTypes) {
            this._type = type;
        }

        public fromEvent(evt:any) {

            switch(true) {

                case (evt.type === 'blur'):
                    this._type = CommandTypes.BLUR;
                    break;
                case (evt.keyCode === KeyCodes.UP):
                    this._type = CommandTypes.UP;
                    break;

                case (evt.keyCode === KeyCodes.DOWN):
                    this._type = CommandTypes.DOWN;
                    break;

                case (evt.shiftKey && evt.keyCode === KeyCodes.TAB):
                    this._type = CommandTypes.SHIFT_TAB;
                    break;

                case (evt.keyCode === KeyCodes.LEFT):
                    this._type = CommandTypes.LEFT;
                    break;

                case (!evt.shiftKey && evt.keyCode === KeyCodes.TAB):
                    this._type = CommandTypes.TAB;
                    break;

                case (evt.keyCode === KeyCodes.RIGHT):
                    this._type = CommandTypes.RIGHT;
                    break;

                case (!evt.shiftKey && evt.keyCode === KeyCodes.ENTER):
                    this._type = CommandTypes.ENTER;
                    break;

                case (evt.keyCode === KeyCodes.BACKSPACE):
                    this._type = CommandTypes.BACKSPACE;
                    break;

                case (evt.keyCode === KeyCodes.DELETE):
                    this._type = CommandTypes.DELETE;
                    break;

                case (evt.keyCode === KeyCodes.ESCAPE):
                    this._type = CommandTypes.ESC;
                    break;

                default:
                    this._type = CommandTypes.NONE;
                    break;
            }
        }

        public blur() {
            return this._type === CommandTypes.BLUR;
        }

        public up() {
            return this._type === CommandTypes.UP;
        }

        public down() {
            return this._type === CommandTypes.DOWN;
        }

        public left() {
            return this._type === CommandTypes.LEFT;
        }

        public right() {
            return this._type === CommandTypes.RIGHT;
        }

        public shiftTab() {
            return this._type === CommandTypes.SHIFT_TAB;
        }

        public tab() {
            return this._type === CommandTypes.TAB;
        }

        public enter() {
            return this._type === CommandTypes.ENTER;
        }

        public backspace() {
            return this._type === CommandTypes.BACKSPACE;
        }

        public delete() {
            return this._type === CommandTypes.DELETE;
        }

        public esc() {
            return this._type === CommandTypes.ESC;
        }

        public static fromEvent(evt: any) {
            var command = new Command();
            command.fromEvent(evt);
            return command;
        }

        public static fromType(type: CommandTypes) {
            var command = new Command();
            command.type(type);
            return command;
        }
    }
}