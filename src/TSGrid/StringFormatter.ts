///<reference path="CellFormatter.ts"/>

module TSGrid {

    /**
     Formatter to convert any value to string.
     @class TSGrid.StringFormatter
     @extends TSGrid.CellFormatter
     @constructor
     */
    export class StringFormatter extends CellFormatter {

        /**
         Converts any value to a string using Ecmascript's implicit type
         conversion. If the given value is `null` or `undefined`, an empty string is
         returned instead.
         @member TSGrid.StringFormatter
         @param {*} rawValue
         @param {TSCore.Data.Model} model Used for more complicated formatting
         @return {string}
         */
        public fromRaw(rawValue: string, model: TSCore.Data.Model) {
            if (_.isUndefined(rawValue) || _.isNull(rawValue)) return '';
            return rawValue + '';
        }
    }
}