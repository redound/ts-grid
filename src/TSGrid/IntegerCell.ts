///<reference path="NumberCell.ts"/>

module TSGrid {


    /**
     An IntegerCell is just a NumberCell with 0 decimals. If a floating
     point number is supplied, the number is simply rounded the usual way when
     displayed.
     @class TSGrid.IntegerCell
     @extends TSGrid.NumberCell
     */
    export class IntegerCell extends NumberCell {

        public className: string = 'integer-cell';

        public decimals: number = 0;
    }
}