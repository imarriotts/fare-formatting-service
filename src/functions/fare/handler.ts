import { DynamoDBTableKeys, DynamoDBTableSortKeys, DynamoDBTables } from "@functions/services/aws/constants";
import { dynamoDbHelper } from "@functions/services/aws/dynamodb";
import { FareBuilder } from "./builder";
import { Fare, fareConvert, fareCreate, fareDelete, fareSearch } from "./types";
import { checkFareInput } from "./util";

/**
 * @description Creates or updates a fare configuration
 * @param input 
 * @returns 
 */
export const upsert = async (input: fareCreate) => {
    const { country, currency } = input;
    // check if the country and currency are valid
    await checkFareInput(country, currency);
    // upsert data to dynamodb
    const createdItem = await dynamoDbHelper.putItem(DynamoDBTables.FareCountryConfigTable, input);
    // return data
    return createdItem;
}

/**
 * @description Search for a fare configuration
 * @param input 
 * @returns 
 */
export const search = async (input: fareSearch) => {
    const { country, currency } = input;

    // create a key for dynamodb
    const key = {
        [DynamoDBTableKeys.CountryConfig]: country,
        [DynamoDBTableSortKeys.CountryConfig]: currency,
    }

    // get data from dynamodb
    const fetchedItem = await dynamoDbHelper.getItem(DynamoDBTables.FareCountryConfigTable, key);

    // if no fare configuration is found, throw an error
    if (!fetchedItem) {
        throw new Error('No fare configuration found');
    }

    // return data
    return fetchedItem;
}

/**
 * @description Deletes a fare configuration
 * @param input 
 */
export const obliterate = async (input: fareDelete) => {
    const { country, currency } = input;

    // create a key for dynamodb
    const key = {
        [DynamoDBTableKeys.CountryConfig]: country,
        [DynamoDBTableSortKeys.CountryConfig]: currency,
    }

    // delete data from dynamodb
    await dynamoDbHelper.deleteItem(DynamoDBTables.FareCountryConfigTable, key);
}

/**
 * @description Converts a value to a formatted string
 * @param input 
 * @returns 
 */
export const convert = async (input: fareConvert) => {
    let isDefault = false;
    const { country, currency, value } = input;

    // get the fare configuration from dynamodb
    let fareConfig = await dynamoDbHelper.getItem(DynamoDBTables.FareCountryConfigTable, {
        [DynamoDBTableKeys.CountryConfig]: country,
        [DynamoDBTableSortKeys.CountryConfig]: currency,
    });

    // if no fare configuration is found, get the default configuration
    if (!fareConfig) {
        fareConfig = await dynamoDbHelper.getItem(DynamoDBTables.FareBasicConfigTable, {
            [DynamoDBTableKeys.BaseConfig]: 'fare',
            [DynamoDBTableSortKeys.BaseConfig]: 'default',
        });
        isDefault = true;
    }

    // if no fare configuration is found, throw an error
    if (!fareConfig) {
        throw new Error('No fare configuration found');
    }

    // get the fare configuration data
    const fare = fareConfig.data as Fare;

    // use the builder to format the value
    const formattedValue = new FareBuilder(fare).formatNumber(value);

    // return the formatted value
    return {
        country,
        currency,
        value: formattedValue,
        isDefault,
    };
}
