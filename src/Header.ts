import List from "ts-core/lib/Data/List";
import View from "./View";
import Column, {COLUMN_EVENTS} from "./Column";
import HeaderRow from "./HeaderRow";
import Grid from "./Grid";
import * as $ from "jquery";

export default class Header extends View {

    public tagName:string = 'div';

    public className:string = 'ts-grid-header';

    public viewEvents:any = {
        "dragstart": "dragstart"
    };

    public columns:List<Column>;

    public cols:List<JQuery> = new List<JQuery>();

    public row:HeaderRow;

    public _grid:Grid;

    public $table:JQuery;

    public $colgroup:JQuery;

    public constructor(columns:List<Column>) {

        super();

        this.columns = columns;

        this.initialize();
    }

    public initialize() {

        super.initialize();

        this.row = new HeaderRow(this.columns);

        this.columns.each(column => {
            column.events.on(COLUMN_EVENTS.CHANGED_WIDTH, e => this.columnChangedWidth(e));
        });
    }

    protected columnChangedWidth(e) {

        var column = e.params.column;
        var columnIndex = this.columns.indexOf(column);

        var col = this.cols.get(columnIndex);

        if (col) {
            col.width(column.getWidth());
        }
    }

    /**
     * Prevent columnResizer to cause
     * dragstart on all elements inside the header
     * @param e
     */
    protected dragstart(e) {

        e.preventDefault();
        e.stopPropagation();
    }

    public setGrid(grid:Grid):this {
        this._grid = grid;
        return this;
    }

    public getGrid():Grid {
        return this._grid;
    }

    public render():this {

        var grid = this.getGrid();

        this.$table = $('<table />');
        this.$colgroup = $('<colgroup />');
        this.cols.clear();
        this.columns.each(column => {
            var $col = $('<col />');
            $col.css('width', column.getWidth());
            this.$colgroup.append($col);
            this.cols.add($col);
        });
        var $thead = $('<thead />');
        this.$table.append(this.$colgroup);
        this.$table.append($thead);
        $thead.append(this.row.render().$el);

        this.$table.attr('width', grid.getInnerWidth());

        this.$el.append(this.$table);

        this.delegateEvents();
        return this;
    }
}
