///<reference path="CommandTypes.ts"/>

module TSGrid {

    export class Command {

        public commandType:CommandTypes;

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

            if (evt) {
                _.extend(this, {
                    type: evt.type,
                    altKey: !!evt.altKey,
                    "char": evt["char"],
                    charCode: evt.charCode,
                    ctrlKey: !!evt.ctrlKey,
                    key: evt.key,
                    keyCode: evt.keyCode,
                    locale: evt.locale,
                    location: evt.location,
                    metaKey: !!evt.metaKey,
                    repeat: !!evt.repeat,
                    shiftKey: !!evt.shiftKey,
                    which: evt.which
                });
            }

            if (this.keyCode === 38) {

                this.commandType = CommandTypes.MOVE_UP;

            } else if (this.keyCode === 40) {

                this.commandType = CommandTypes.MOVE_DOWN;

            } else if (this.shiftKey && this.keyCode === 9) {

                this.commandType = CommandTypes.MOVE_LEFT;

            } else if (!this.shiftKey && this.keyCode === 9) {

                this.commandType = CommandTypes.MOVE_RIGHT;

            } else if (!this.shiftKey && this.keyCode === 13) {

                this.commandType = CommandTypes.SAVE;

            } else if (this.keyCode === 27) {

                this.commandType = CommandTypes.CANCEL;

            } else {

                this.commandType = CommandTypes.NONE;
            }
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

        /**
         Up Arrow
         @member TSGrid.Command
         */
        public moveUp() {
            return this.commandType === CommandTypes.MOVE_UP;
        }

        /**
         Down Arrow
         @member TSGrid.Command
         */
        public moveDown() {
            return this.commandType === CommandTypes.MOVE_DOWN;
        }

        /**
         Shift Tab
         @member TSGrid.Command
         */
        public moveLeft() {
            return this.commandType === CommandTypes.MOVE_LEFT;
        }

        /**
         Tab
         @member TSGrid.Command
         */
        public moveRight() {
            return this.commandType === CommandTypes.MOVE_RIGHT;
        }

        /**
         Enter
         @member TSGrid.Command
         */
        public save() {
            return this.commandType === CommandTypes.SAVE;
        }

        /**
         Esc
         @member TSGrid.Command
         */
        public cancel() {
            return this.commandType === CommandTypes.CANCEL;
        }

        /**
         None of the above.
         @member TSGrid.Command
         */
        public passThru() {
            return !(this.moveUp() || this.moveDown() || this.moveLeft() ||
            this.moveRight() || this.save() || this.cancel());
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
    }
}