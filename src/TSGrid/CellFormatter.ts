module TSGrid {

    export interface ICellFormatter {
        new (): CellFormatter;
    }

    /**
     Just a convenient class for interested parties to subclass.
     @abstract
     @class TSGrid.CellFormatter
     @constructor
     */
    export class CellFormatter extends TSCore.BaseObject {

        /**
         Takes a raw value from a model and returns an optionally formatted string
         for display. The default implementation simply returns the supplied value
         as is without any type conversion.
         @member TSCore.CellFormatter
         @param {*} rawData
         @param {TSCore.Data.Model} model Used for more complicated formatting
         @return {*}
         */
        public fromRaw(rawData, model) {
            return rawData;
        }

        /**
         Takes a formatted string, usually from user input, and returns a
         appropriately typed value for persistence in the model.
         If the user input is invalid or unable to be converted to a raw value
         suitable for persistence in the model, toRaw must return `undefined`.
         @member TSGrid.CellFormatter
         @param {string} formattedData
         @param {TSCore.Data.Model} model Used for more complicated formatting
         @return {*|undefined}
         */
        public toRaw(formattedData, model) {
            return formattedData;
        }
    }
}