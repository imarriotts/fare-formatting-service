import { FareBuilder } from "./builder";
import { DisplayFormat, Fare } from "./types";

const fares: Fare[] = [
    {
        displayCents: true,
        displayFormat: DisplayFormat.COMMA_SEPARATOR,
        useCurrencyCode: true,
        currencyCode: 'USD',
        displayAfter: true,
        currencySymbol: "$"
    },
    {
        displayCents: false,
        displayFormat: DisplayFormat.DOT_SEPARATOR,
        useCurrencyCode: false,
        currencySymbol: '€',
        displayAfter: false,
        currencyCode: "EUR"
    },
    {
        displayCents: false,
        displayFormat: DisplayFormat.DOT_SEPARATOR,
        useCurrencyCode: true,
        currencySymbol: '¥',
        displayAfter: true,
        currencyCode: "JPY"
    },
    {
        displayCents: true,
        displayFormat: DisplayFormat.COMMA_SEPARATOR,
        useCurrencyCode: false,
        currencySymbol: '₹',
        displayAfter: false,
        currencyCode: "INR"
    },
    {
        displayCents: true,
        displayFormat: DisplayFormat.DOT_SEPARATOR,
        useCurrencyCode: true,
        currencySymbol: '₽',
        displayAfter: true,
        currencyCode: "RUB"
    },
    {
        displayCents: false,
        displayFormat: DisplayFormat.COMMA_SEPARATOR,
        useCurrencyCode: false,
        currencySymbol: '₣',
        displayAfter: true,
        currencyCode: "CHF"
    },
    {
        displayCents: true,
        displayFormat: DisplayFormat.DOT_SEPARATOR,
        useCurrencyCode: true,
        currencySymbol: '₤',
        displayAfter: false,
        currencyCode: "TRY"
    },
    {
        displayCents: false,
        displayFormat: DisplayFormat.COMMA_SEPARATOR,
        useCurrencyCode: false,
        currencySymbol: '₩',
        displayAfter: true,
        currencyCode: "KRW"
    },
    {
        displayCents: true,
        displayFormat: DisplayFormat.DOT_SEPARATOR,
        useCurrencyCode: true,
        currencySymbol: 'R$',
        displayAfter: false,
        currencyCode: "BRL"
    },
    {
        displayCents: false,
        displayFormat: DisplayFormat.COMMA_SEPARATOR,
        useCurrencyCode: false,
        currencySymbol: 'kr',
        displayAfter: true,
        currencyCode: "SEK"
    }
];

describe('FareBuilder', () => {
    it('should correctly format number', () => {
        const num = 1234567.891;
        const expectedResults = [
            '1,234,567.89 USD', // United States: displayCents = true, displayFormat = DisplayFormat.COMMA_SEPARATOR, useCurrencyCode = true, currencySymbol = '$', displayAfter = true
            '€ 1.234.567',      // European Union: displayCents = false, displayFormat = DisplayFormat.DOT_SEPARATOR, useCurrencyCode = false, currencySymbol = '€', displayAfter = false
            '1.234.567 JPY',    // Japan: displayCents = false, displayFormat = DisplayFormat.DOT_SEPARATOR, useCurrencyCode = true, currencySymbol = '¥', displayAfter = true
            '₹ 1,234,567.89',   // India: displayCents = true, displayFormat = DisplayFormat.COMMA_SEPARATOR, useCurrencyCode = false, currencySymbol = '₹', displayAfter = false
            '1.234.567,89 RUB', // United Kingdom: displayCents = true, displayFormat = DisplayFormat.DOT_SEPARATOR, useCurrencyCode = true, currencySymbol = '₽', displayAfter = true
            '1,234,567 ₣',      // Switzerland: displayCents = false, displayFormat = DisplayFormat.COMMA_SEPARATOR, useCurrencyCode = false, currencySymbol = '₣', displayAfter = true
            'TRY 1.234.567,89', // Turkey: displayCents = true, displayFormat = DisplayFormat.DOT_SEPARATOR, useCurrencyCode = true, currencySymbol = '₤', displayAfter = false
            '1,234,567 ₩',      // South Korea: displayCents = false, displayFormat = DisplayFormat.COMMA_SEPARATOR, useCurrencyCode = false, currencySymbol = '₩', displayAfter = true
            'BRL 1.234.567,89', // Brazil: displayCents = true, displayFormat = DisplayFormat.DOT_SEPARATOR, useCurrencyCode = true, currencySymbol = 'R$', displayAfter = false
            '1,234,567 kr'      // Sweden: displayCents = false, displayFormat = DisplayFormat.COMMA_SEPARATOR, useCurrencyCode = false, currencySymbol = 'kr', displayAfter = true
        ]

        fares.forEach((fare, index) => {
            const fareBuilder = new FareBuilder(fare);
            console.log(`Testing fare configuration: ${JSON.stringify(fare)}`);
            expect(fareBuilder.formatNumber(num)).toEqual(expectedResults[index]);
        });
    });
});
