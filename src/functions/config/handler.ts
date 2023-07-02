import { dynamoDbHelper } from "@functions/services/aws/dynamodb";
import { DynamoDBTableKeys, DynamoDBTableSortKeys, DynamoDBTables } from "@functions/services/aws/constants";
import { SearchConfig } from "./types";
import { propagateConfig } from "./utils";

/**
 * @description Search for a basic configuration
 * @param input 
 * @returns 
 */
export const search = async (input: SearchConfig) => {
    const { id, type } = input;

    // create a key for dynamodb
    const key = {
        [DynamoDBTableKeys.BaseConfig]: id,
    }
    if (type) {
        key[DynamoDBTableSortKeys.BaseConfig] = type;
    }

    // get data from dynamodb
    const fetchedItem = await dynamoDbHelper.getItem(DynamoDBTables.FareBasicConfigTable, key);

    if (!fetchedItem) {
        throw new Error(`No ${id} configuration found with type ${type}`);
    }

    // return data
    return fetchedItem;
};

/**
 * Creates or updates a basic configuration
 * @param input 
 * @returns 
 */
export const create = async (input: SearchConfig) => {
    // upsert data to dynamodb
    const createdItem = await dynamoDbHelper.putItem(DynamoDBTables.FareBasicConfigTable, input);
    // return data
    return createdItem;
}

/**
 * @description Propagates a basic configuration to database
 */
export const propagateInitialData = async () => {
    // first check if the config is already propagated
    const [countryData, currencyData, fareData] = await Promise.all([
        dynamoDbHelper.getItem(DynamoDBTables.FareBasicConfigTable, {
            [DynamoDBTableKeys.BaseConfig]: 'country',
            [DynamoDBTableSortKeys.BaseConfig]: 'default',
        }),
        dynamoDbHelper.getItem(DynamoDBTables.FareBasicConfigTable, {
            [DynamoDBTableKeys.BaseConfig]: 'currency',
            [DynamoDBTableSortKeys.BaseConfig]: 'default',
        }),
        dynamoDbHelper.getItem(DynamoDBTables.FareBasicConfigTable, {
            [DynamoDBTableKeys.BaseConfig]: 'fare',
            [DynamoDBTableSortKeys.BaseConfig]: 'default',
        }),
    ]);

    // if it is, trhow an error
    if (countryData && currencyData && fareData) {
        throw new Error('Config already propagated');
    }

    // if not, propagate the config
    await propagateConfig(countryData, currencyData, fareData);
}