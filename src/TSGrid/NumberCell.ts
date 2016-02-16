///<reference path="View.ts"/>

module TSGrid {

    /**
     NumberCell is a generic cell that renders all numbers. Numbers are formatted
     using a TSGrid.NumberFormatter.
     @class TSGrid.NumberCell
     @extends TSGrid.Cell
     */
    export class NumberCell extends Cell {

        public className: string = 'number-cell';

        public decimals: number = NumberFormatter.defaults.decimals;

        public decimalSeparator: string = NumberFormatter.defaults.decimalSeparator;

        public orderSeparator: string = NumberFormatter.defaults.orderSeparator;

        public formatter: CellFormatter;

        public constructor(column: Column, model: TSCore.Data.Model, editor?: ICellEditor, formatter?: ICellFormatter) {

            super(column, model, editor, formatter);
        }

        public initialize() {

            super.initialize();
        }
    }
}