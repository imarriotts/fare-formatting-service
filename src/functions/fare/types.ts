export enum DisplayFormat {
    COMMA_SEPARATOR = '#,###.##',
    DOT_SEPARATOR = '#.###,##'
}

export interface Fare {
    /**
     * Currency code like 'USD'
     */
    currencyCode: string;
    /**
     * Currency symbol like '$'
     */
    currencySymbol: string;
    /**
     * True if the currency symbol is to be displayed after the number
     */
    displayAfter: boolean;
    /**
     * True if cents are to be displayed
     */
    displayCents: boolean;
    /**
     * Display format like '#,###.##' or '#.###,##'
     */
    displayFormat: DisplayFormat;
    /**
     * True if currency code should be used over symbol
     */
    useCurrencyCode: boolean;
}

export interface fareCreate {
    country: string;
    currency: string;
    data: Fare;
}

export interface fareDelete {
    country: string;
    currency: string;
}

export interface fareSearch {
    country: string;
    currency: string;
}

export interface fareConvert {
    country: string;
    currency: string;
    value: number;
}

export interface configCountry {
    id: string;
    type: string;
    data: Array<{
        countryCode: string;
        name: string;
    }>
}

export interface configCurrency {
    id: string;
    type: string;
    data: Array<{
        currencyName: string;
        currencyCode: string;
    }>
}