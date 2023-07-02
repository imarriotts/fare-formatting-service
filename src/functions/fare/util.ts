import { DynamoDBTableKeys, DynamoDBTableSortKeys, DynamoDBTables } from "@functions/services/aws/constants";
import { dynamoDbHelper } from "@functions/services/aws/dynamodb";
import { configCountry, configCurrency } from "./types";

/**
 * @description Checks if the country and currency are valid
 * @param country 
 * @param currency 
 */
export const checkFareInput = async (country: string, currency: string) => {
    // this should be done with redis or some other caching mechanism
    // but for now, we'll just check if the country and currency are valid
    // by checking if the country and currency are in the fare config table
    const [countryConfig, currencyConfig] = await Promise.all([
        dynamoDbHelper.getItem(DynamoDBTables.FareBasicConfigTable, {
            [DynamoDBTableKeys.BaseConfig]: 'country',
            [DynamoDBTableSortKeys.BaseConfig]: 'default',
        }) as Promise<configCountry>,
        dynamoDbHelper.getItem(DynamoDBTables.FareBasicConfigTable, {
            [DynamoDBTableKeys.BaseConfig]: 'currency',
            [DynamoDBTableSortKeys.BaseConfig]: 'default',
        }) as Promise<configCurrency>
    ]);

    // check if the country is valid
    const countryIsValid = countryConfig.data.some((countryData) => countryData.countryCode === country);

    // check if the currency is valid
    const currencyIsValid = currencyConfig.data.some((currencyData) => currencyData.currencyCode === currency);

    // if the country or currency is invalid, throw an error
    if (!countryIsValid || !currencyIsValid) {
        throw new Error('Invalid country or currency');
    }
};