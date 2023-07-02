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

        // Split the number into integer and decimal parts
        const [integerPart, decimalPart] = num.toString().split('.');

        // Format the integer part
        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);

        // Round the decimal part
        let formattedDecimalPart = decimalPart ? decimalPart.slice(0, decimalPoints) : '';

        // Combine the parts if necessary
        let formattedNumber = formattedIntegerPart;
        if (this.fare.displayCents) {
            formattedNumber += decimalSeparator + formattedDecimalPart.padEnd(decimalPoints, '0');
        }

        // Decide the currency display
        const currencyDisplay = this.fare.useCurrencyCode ? this.fare.currencyCode : (this.fare.currencySymbol || this.fare.currencyCode);

        // Handle displayAfter
        if (this.fare.displayAfter) {
            return `${formattedNumber} ${currencyDisplay}`.trim();
        } else {
            return `${currencyDisplay} ${formattedNumber}`.trim();
        }
    }
}