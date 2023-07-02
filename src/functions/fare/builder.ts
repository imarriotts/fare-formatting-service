import { DisplayFormat, Fare } from "./types";

export class FareBuilder {
    private fare: Fare;

    constructor(fare: Fare) {
        this.fare = fare;
    }

    formatNumber(num: number): string {
        // Decide the decimal points
        const decimalPoints = this.fare.displayCents ? 2 : 0;

        // Decide the group and decimal separators
        const groupSeparator = this.fare.displayFormat === DisplayFormat.COMMA_SEPARATOR ? ',' : '.';
        const decimalSeparator = this.fare.displayFormat === DisplayFormat.COMMA_SEPARATOR ? '.' : ',';

        // Format the number
        const formattedNumber = num.toFixed(decimalPoints).replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator).replace('.', decimalSeparator);

        // Decide the currency display
        const currencyDisplay = this.fare.useCurrencyCode ? this.fare.currencyCode : (this.fare.currencySymbol || this.fare.currencyCode);

        // Handle displayAfter
        if (this.fare.displayAfter) {
            return `${formattedNumber} ${currencyDisplay}`;
        } else {
            return `${currencyDisplay} ${formattedNumber}`;
        }
    }
}