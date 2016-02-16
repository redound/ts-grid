///<reference path="View.ts"/>

module TSGrid {

    /**
     @class TSGrid.TextCell
     @extends TSGrid.Cell
     */
    export class TextCell extends Cell {

        public className: string = 'text-cell';

        public editor: ICellEditor = TextCellEditor;

        public formatter: CellFormatter;
    }
}