import { CommandTypes } from "./CommandTypes";
export default class Command {
    protected _type: CommandTypes;
    type(type: CommandTypes): void;
    fromEvent(evt: any): void;
    blur(): boolean;
    up(): boolean;
    down(): boolean;
    left(): boolean;
    right(): boolean;
    shiftTab(): boolean;
    tab(): boolean;
    enter(): boolean;
    backspace(): boolean;
    delete(): boolean;
    esc(): boolean;
    static fromEvent(evt: any): Command;
    static fromType(type: CommandTypes): Command;
}
