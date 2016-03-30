import List from "ts-core/lib/Data/List";
import ActiveModel from "ts-data/lib/Model/ActiveModel";
import Column from "./Column";
import View from "./View";
import EventEmitter from "ts-core/lib/Events/EventEmitter";
import Cell, {CELL_EVENTS} from "./Cell";

export interface RowInterface {
    new (columns:List<Column>, model:ActiveModel):Row;
}

export const ROW_EVENTS = {
    CHANGED: 'row:changed'
};

export default class Row extends View {

    public tagName:string = 'tr';

    public columns:List<Column>;

    public modelId:any;

    public model:ActiveModel;

    public cells:List<Cell>;

    public events:EventEmitter = new EventEmitter();

    protected _active;

    protected _loading;

    public valid:boolean = false;

    public constructor(columns:List<Column>, model:ActiveModel) {

        super();

        this.columns = columns;

        this.setModel(model);

        this.cells = new List<Cell>();

        this.initialize();
    }

    public initialize() {

        super.initialize();

        this.columns.each(column => {
            this.cells.add(this.makeCell(column));
        });
    }

    public setLoading(loading:boolean) {
        this._loading = loading;

        if (this._loading) {
            this.$el.addClass('loading');
        } else {
            this.$el.removeClass('loading');
        }
    }

    public setActive(active:boolean) {
        this._active = active;

        if (this._active) {
            this.$el.addClass('active');
        } else {
            this.$el.removeClass('active');
        }
    }

    public setModel(model:ActiveModel):this {

        if (!model) return;
        this.model = model;
        this.modelId = model.getId();
        return this;
    }

    public makeCell(column:Column) {

        var cellType = column.getCellType();

        var cell = new cellType(
            column,
            this.model
        );

        cell.events.on(CELL_EVENTS.CHANGED, e => this.cellDidChange(e));
        cell.events.on(CELL_EVENTS.CLEARED, e => this.cellDidClear(e));

        return cell;
    }

    protected cellDidChange(e) {

        this.events.trigger(ROW_EVENTS.CHANGED, {row: this});
        this.render();
    }

    protected cellDidClear(e) {
        this.render();
    }

    /**
     * Renders a row of cells for this row's model
     */
    public render():this {

        this.$el.empty();

        var fragment = document.createDocumentFragment();
        this.cells.each(cell => {
            cell.validationEnabled(true);
            fragment.appendChild(cell.render().el);
        });

        this.el.appendChild(fragment);

        this.delegateEvents();

        return this;
    }

    public reset() {

    }
}
