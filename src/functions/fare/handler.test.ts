import * as dynamoDbHelper from "@functions/services/aws/dynamodb";
import { DynamoDBTableKeys, DynamoDBTableSortKeys, DynamoDBTables } from "@functions/services/aws/constants";
import { convert, obliterate, search, upsert } from './handler';
import { Fare } from "./types";
import * as util from "./util";
import { FareBuilder } from "./builder";

describe('fare handler', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create or update a fare configuration', async () => {
        const mockFareCreate = {
            country: 'US',
            currency: 'USD',
            data: {
            } as Fare,
        };

        jest.spyOn(dynamoDbHelper, 'putItem').mockResolvedValue(mockFareCreate as any)
        jest.spyOn(util, 'checkFareInput').mockImplementation(() => Promise.resolve())

        const result = await upsert(mockFareCreate);

        expect(dynamoDbHelper.putItem).toHaveBeenCalledWith(DynamoDBTables.FareCountryConfigTable, mockFareCreate);

        expect(result).toEqual(mockFareCreate);
    });

    it('should fetch a fare configuration', async () => {
        const mockFareSearch = {
            country: 'US',
            currency: 'USD'
        };

        const mockFareResult = {};

        jest.spyOn(dynamoDbHelper, 'getItem').mockResolvedValue(mockFareResult as any);

        const result = await search(mockFareSearch);

        expect(dynamoDbHelper.getItem).toHaveBeenCalledWith(DynamoDBTables.FareCountryConfigTable, {
            [DynamoDBTableKeys.CountryConfig]: mockFareSearch.country,
            [DynamoDBTableSortKeys.CountryConfig]: mockFareSearch.currency,
        });

        expect(result).toEqual(mockFareResult);
    });

    it('should throw an error if no fare configuration found', async () => {
        const mockFareSearch = {
            country: 'US',
            currency: 'USD'
        };

        jest.spyOn(dynamoDbHelper, 'getItem').mockResolvedValue(null);

        await expect(search(mockFareSearch)).rejects.toThrow('No fare configuration found');
    });

    it('should delete a fare configuration', async () => {
        const mockFareDelete = {
            country: 'US',
            currency: 'USD'
        };

        jest.spyOn(dynamoDbHelper, 'deleteItem').mockResolvedValue({} as any);

        await obliterate(mockFareDelete);

        expect(dynamoDbHelper.deleteItem).toHaveBeenCalledWith(DynamoDBTables.FareCountryConfigTable, {
            [DynamoDBTableKeys.CountryConfig]: mockFareDelete.country,
            [DynamoDBTableSortKeys.CountryConfig]: mockFareDelete.currency,
        });
    });

    it('should convert a value to a formatted string', async () => {
        const mockFareConvert = {
            country: 'US',
            currency: 'USD',
            value: 1000
        };

        const mockFareConfig = {
            country: 'US',
            currency: 'USD',
            data: {} as Fare
        };

        jest.spyOn(dynamoDbHelper, 'getItem').mockResolvedValueOnce(mockFareConfig as any)
        jest.spyOn(FareBuilder.prototype, 'formatNumber').mockReturnValue('1,000')

        const result = await convert(mockFareConvert);

        expect(dynamoDbHelper.getItem).toHaveBeenCalledWith(DynamoDBTables.FareCountryConfigTable, {
            [DynamoDBTableKeys.CountryConfig]: mockFareConvert.country,
            [DynamoDBTableSortKeys.CountryConfig]: mockFareConvert.currency,
        });
        expect(FareBuilder.prototype.formatNumber).toHaveBeenCalledWith(mockFareConvert.value);

        expect(result).toEqual({
            country: mockFareConvert.country,
            currency: mockFareConvert.currency,
            value: '1,000',
            isDefault: false,
        });
    });

    it('should use default configuration if no fare configuration is found', async () => {
        const mockFareConvert = {
            country: 'US',
            currency: 'USD',
            value: 1000
        };

        const mockDefaultFareConfig = {
            [DynamoDBTableKeys.BaseConfig]: 'fare',
            [DynamoDBTableSortKeys.BaseConfig]: 'default',
            data: {} as Fare
        };

        jest.spyOn(dynamoDbHelper, 'getItem').mockResolvedValueOnce(null).mockResolvedValueOnce(mockDefaultFareConfig as any)
        jest.spyOn(FareBuilder.prototype, 'formatNumber').mockReturnValue('1,000')

        const result = await convert(mockFareConvert);

        expect(dynamoDbHelper.getItem).toHaveBeenCalledTimes(2);
        expect(dynamoDbHelper.getItem).toHaveBeenCalledWith(DynamoDBTables.FareCountryConfigTable, {
            [DynamoDBTableKeys.CountryConfig]: mockFareConvert.country,
            [DynamoDBTableSortKeys.CountryConfig]: mockFareConvert.currency,
        });
        expect(dynamoDbHelper.getItem).toHaveBeenCalledWith(DynamoDBTables.FareBasicConfigTable, {
            [DynamoDBTableKeys.BaseConfig]: 'fare',
            [DynamoDBTableSortKeys.BaseConfig]: 'default',
        });

        expect(result).toEqual({
            country: mockFareConvert.country,
            currency: mockFareConvert.currency,
            value: '1,000',
            isDefault: true,
        });
    });

});


