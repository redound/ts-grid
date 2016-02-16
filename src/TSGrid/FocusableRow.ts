///<reference path="Row.ts"/>


module TSGrid {

    export class FocusableRow extends Row {

        public highlightColor: string = '#F5F5F5';
        public removeHighlightTimeout;

        public viewEvents: any = {
            "focusin": "rowFocused",
            "focusout": "rowLostFocus"
        };

        public rowFocused() {

            if (this.removeHighlightTimeout) {
                clearTimeout(this.removeHighlightTimeout);
            }

            this.$el.css('backgroundColor', this.highlightColor);
        }

        public rowLostFocus() {

            this.removeHighlightTimeout = setTimeout(() => {
                this.$el.css('backgroundColor', 'initial');
                this.removeHighlightTimeout = null;
            }, 40);
        }
    }
}