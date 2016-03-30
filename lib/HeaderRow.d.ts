import View from "./View";
import Column from "./Column";
import List from "ts-core/lib/Data/List";
import HeaderCell from "./HeaderCell";
export default class HeaderRow extends View {
    tagName: string;
    columns: List<Column>;
    cells: List<HeaderCell>;
    constructor(columns: List<Column>);
    initialize(): void;
    makeCell(column: Column): HeaderCell;
    render(): this;
}
