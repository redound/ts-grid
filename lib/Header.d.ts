import List from "ts-core/lib/Data/List";
import View from "./View";
import Column from "./Column";
import HeaderRow from "./HeaderRow";
import Grid from "./Grid";
export default class Header extends View {
    tagName: string;
    className: string;
    viewEvents: any;
    columns: List<Column>;
    cols: List<JQuery>;
    row: HeaderRow;
    _grid: Grid;
    $table: JQuery;
    $colgroup: JQuery;
    constructor(columns: List<Column>);
    initialize(): void;
    protected columnChangedWidth(e: any): void;
    protected dragstart(e: any): void;
    setGrid(grid: Grid): this;
    getGrid(): Grid;
    render(): this;
}
