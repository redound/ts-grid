///<reference path="CellFormatter.ts"/>

module TSGrid {

    export interface NumberFormatterOptions {
        decimals?: number,
        decimalSeparator?: string,
        orderSeparator?: string
    }

    /**
     A floating point number formatter. Doesn't understand scientific notation at
     the moment.
     @class TSGrid.NumberFormatter
     @extends TSGrid.CellFormatter
     @constructor
     @throws {RangeError} If decimals < 0 or > 20.
     */
    export class NumberFormatter extends CellFormatter {

        public static HUMANIZED_NUM_RE = /(\d)(?=(?:\d{3})+$)/g;

        public static defaults = {
            decimals: 0,
            decimalSeparator: '.',
            orderSeparator: ','
        };

        /**
         * Number of decimals to display. Must be an integer.
         */
        public decimals: number;

        /**
         * The separator to use when displaying decimals.
         * @type {string}
         */
        public decimalSeparator: string = '.';

        /**
         * The separator to use to separator thousands. May be an empty string.
         * @type {string}
         */
        public orderSeparator: string = ',';

        constructor(options: NumberFormatterOptions) {

            super();

            _.extend(this, this.static.defaults, options || {});

            if (this.decimals < 0 || this.decimals > 20) {
                throw new RangeError("decimals must be between 0 and 20");
            }
        }

        /**
         Takes a floating point number and convert it to a formatted string where
         every thousand is separated by `orderSeparator`, with a `decimal` number of
         decimals separated by `decimalSeparator`. The number returned is rounded
         the usual way.
         @member TSGrid.NumberFormatter
         @param {number} number
         @param {TSCore.Data.Model} model Used for more complicated formatting
         @return {string}
         */
        public fromRaw(number: number, model: TSCore.Data.Model): string {

            if (_.isNull(number) || _.isUndefined(number)) return '';

            var fixedNumber:string = <string>number.toFixed(~~this.decimals);

            var parts = fixedNumber.split('.');
            var integerPart = parts[0];
            var decimalPart = parts[1] ? (this.decimalSeparator || '.') + parts[1] : '';

            return integerPart.replace(this.static.HUMANIZED_NUM_RE, '$1' + this.orderSeparator) + decimalPart;
        }

        /**
         Takes a string, possibly formatted with `orderSeparator` and/or
         `decimalSeparator`, and convert it back to a number.
         @member Backgrid.NumberFormatter
         @param {string} formattedData
         @param {Backbone.Model} model Used for more complicated formatting
         @return {number|undefined} Undefined if the string cannot be converted to
         a number.
         */
        public toRaw(formattedData, model) {
            formattedData = formattedData.trim();

            if (formattedData === '') return null;

            var rawData = '';

            var thousands = formattedData.split(this.orderSeparator);
            for (var i = 0; i < thousands.length; i++) {
                rawData += thousands[i];
            }

            var decimalParts = rawData.split(this.decimalSeparator);
            rawData = '';
            for (var i = 0; i < decimalParts.length; i++) {
                rawData = rawData + decimalParts[i] + '.';
            }

            if (rawData[rawData.length - 1] === '.') {
                rawData = rawData.slice(0, rawData.length - 1);
            }

            var rawDataNumber: number = parseFloat(rawData);

            var result = rawDataNumber.toFixed(~~this.decimals);
            if (_.isNumber(result) && !_.isNaN(result)) return result;
        }
    }
}