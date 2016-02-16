///<reference path="View.ts"/>

module TSGrid {

    /**
     StringCell displays HTML escaped strings and accepts anything typed in.
     @class TSGrid.StringCell
     @extends TSGrid.Cell
     */
    export class StringCell extends Cell {

        public className: string = 'string-cell';

        public formatter: CellFormatter;
    }
}