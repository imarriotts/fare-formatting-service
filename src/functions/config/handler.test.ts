import { search, create, propagateInitialData } from '@functions/config/handler';
import * as dynamoDbHelper from "@functions/services/aws/dynamodb";
import { DynamoDBTableKeys, DynamoDBTableSortKeys, DynamoDBTables } from "@functions/services/aws/constants";
import { SearchConfig } from "@functions/config/types";
import * as util from './util';

describe('Config handler', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should search for a basic configuration', async () => {
        const mockSearchConfig: SearchConfig = {
            id: 'country',
            type: 'default'
        };

        const mockConfig = {
            id: 'country',
            type: 'default',
            value: 'US'
        };

        jest.spyOn(dynamoDbHelper, 'getItem').mockResolvedValue(mockConfig);

        const result = await search(mockSearchConfig);

        expect(dynamoDbHelper.getItem).toHaveBeenCalledWith(DynamoDBTables.FareBasicConfigTable, {
            [DynamoDBTableKeys.BaseConfig]: mockSearchConfig.id,
            [DynamoDBTableSortKeys.BaseConfig]: mockSearchConfig.type
        });

        expect(result).toEqual(mockConfig);
    });

    it('should create or update a basic configuration', async () => {
        const mockSearchConfig: SearchConfig = {
            id: 'country',
            type: 'default'
        };

        const mockConfig = {
            id: 'country',
            type: 'default',
            value: 'US'
        };

        jest.spyOn(dynamoDbHelper, 'putItem').mockResolvedValue(mockConfig);

        const result = await create(mockSearchConfig);

        expect(dynamoDbHelper.putItem).toHaveBeenCalledWith(DynamoDBTables.FareBasicConfigTable, mockSearchConfig);

        expect(result).toEqual(mockConfig);
    });

    it('should propagate initial data', async () => {
        const propagateConfig = jest.spyOn(util, 'propagateConfig').mockResolvedValue(null);
        jest.spyOn(dynamoDbHelper, 'getItem')
            .mockResolvedValueOnce(null) // assuming the data is not propagated yet
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null);

        await propagateInitialData();

        expect(dynamoDbHelper.getItem).toHaveBeenCalledTimes(3);
        expect(propagateConfig).toBeCalledTimes(1)
    });

    it('should not propagate initial data if already propagated', async () => {
        jest.spyOn(dynamoDbHelper, 'getItem')
            .mockResolvedValueOnce({}) // assuming the data is already propagated
            .mockResolvedValueOnce({})
            .mockResolvedValueOnce({});
            
        await expect(propagateInitialData()).rejects.toThrow('Config already propagated');
    });
});
