export const DynamoDBTables = {
    /**
     * @description Table for storing basic fare configuration
     */
    FareBasicConfigTable: process.env.FARE_BASIC_CONFIG_TABLE ?? 'dev-fare-basic-config',
    /**
     * @description Table for storing country specific fare configuration
     */
    FareCountryConfigTable: process.env.FARE_COUNTRY_CONFIG_TABLE ?? 'dev-fare-country-config',
}

export enum DynamoDBTableKeys {
    BaseConfig = 'id',
    CountryConfig = 'country',
}

export enum DynamoDBTableSortKeys {
    BaseConfig = 'type',
    CountryConfig = 'currency',
}

export const S3Buckets = {
    /**
     * @description Bucket for storing the OpenAPI Swagger documentation
     */
    FareBucket: process.env.FARE_BUCKET ?? 'dev-fare-bucket',
}