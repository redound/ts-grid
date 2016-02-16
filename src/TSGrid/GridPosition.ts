module TSGrid {

    export class GridPosition {

        public rowIndex: number;

        public columnIndex: number;

        public constructor(rowIndex: number, columnIndex: number) {

            this.rowIndex = rowIndex;
            this.columnIndex = columnIndex;
        }

        public maxRowIndex(max: number) {

            this.rowIndex = Math.min(max, Math.max(0, this.rowIndex));
        }

        public maxColumnIndex(max: number) {

            this.columnIndex = Math.min(max, Math.max(0, this.columnIndex));
        }

        public same(gridPosition: GridPosition): boolean {

            return (gridPosition.rowIndex === this.rowIndex && gridPosition.columnIndex === this.columnIndex);
        }
    }
}