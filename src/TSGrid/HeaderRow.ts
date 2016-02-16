///<reference path="Row.ts"/>


module TSGrid {

    export class HeaderRow extends Row {

        public makeCell(column: Column) {

            var headerCell = column.getHeaderCellClass();

            return new headerCell(
                column,
                this.model
            );
        }
    }
}