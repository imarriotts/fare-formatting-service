import { DynamoDBTables, S3Buckets } from "@functions/services/aws/constants";
import * as dynamoDbHelper from "@functions/services/aws/dynamodb";
import { s3Helper } from "@functions/services/aws/s3";

const COUNTRY_FILE = 'country.json';
const CURRENCY_FILE = 'currency.json';
const FARE_FILE = 'defaultFare.json';

enum ConfigType {
    Country = 'country',
    Currency = 'currency',
    Fare = 'fare',
}

/**
 * Reads the file from a s3 folder and returns an object
 * @param type 
 * @returns 
 */
const readData = async (type: ConfigType) => {
    let data: any;
    switch (type) {
        case ConfigType.Country:
            data = await s3Helper.getJson(S3Buckets.FareBucket, COUNTRY_FILE);
            break;
        case ConfigType.Currency:
            data = await s3Helper.getJson(S3Buckets.FareBucket, CURRENCY_FILE);
            break;
        case ConfigType.Fare:
            data = await s3Helper.getJson(S3Buckets.FareBucket, FARE_FILE);
            break;
        default:
            throw new Error('Invalid type');
    }
    return data;
}

/**
 * @description Propagates a basic configuration to database
 * @param countryData 
 * @param currencyData 
 * @param fareData 
 */
export const propagateConfig = async (countryData: any, currencyData: any, fareData: any) => {
    // create an array of promises
    const promises = [];

    // the initial data is on an s3 folder
    // we'll read the data from there, and create a promise for each data
    if (!countryData) {
        const countryData = await readData(ConfigType.Country);
        promises.push(dynamoDbHelper.putItem(DynamoDBTables.FareBasicConfigTable, countryData));
    }
    if (!currencyData) {
        const currencyData = await readData(ConfigType.Currency);
        promises.push(dynamoDbHelper.putItem(DynamoDBTables.FareBasicConfigTable, currencyData));
    }
    if (!fareData) {
        const fareData = await readData(ConfigType.Fare);
        promises.push(dynamoDbHelper.putItem(DynamoDBTables.FareBasicConfigTable, fareData));
    }
    // wait for all promises to finish
    await Promise.all(promises);

}