import View from "./View";
import Column from "./Column";
import List from "ts-core/lib/Data/List";
import HeaderCell from "./HeaderCell";

export default class HeaderRow extends View {

    public tagName:string = 'tr';

    public columns:List<Column>;

    public cells:List<HeaderCell>;

    public constructor(columns:List<Column>) {

        super();

        this.columns = columns;

        this.cells = new List<HeaderCell>();

        this.initialize();
    }

    public initialize() {

        super.initialize();

        this.columns.each(column => {
            this.cells.add(this.makeCell(column));
        });
    }

    public makeCell(column:Column) {

        var headerCell = column.getHeaderType();

        return new headerCell(
            column
        );
    }

    /**
     * Renders a row of cells for this row's model
     */
    public render():this {

        this.$el.empty();

        var fragment = document.createDocumentFragment();
        this.cells.each(cell => {
            fragment.appendChild(cell.render().el);
        });

        this.el.appendChild(fragment);

        this.delegateEvents();

        return this;
    }
}
