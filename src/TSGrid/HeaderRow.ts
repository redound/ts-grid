///<reference path="Row.ts"/>

module TSGrid {

    export class HeaderRow extends Row {

        public makeCell(column: Column) {

            var headerCell = column.getHeaderType();

            return new headerCell(
                column,
                this.model
            );
        }
    }
}