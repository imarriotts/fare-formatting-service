import * as dynamoDbHelper from "@functions/services/aws/dynamodb";
import { s3Helper } from "@functions/services/aws/s3";
import { DynamoDBTables } from "@functions/services/aws/constants";
import { propagateConfig } from "./util";

describe('Config Utils', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should propagate basic configurations to database', async () => {
    const mockCountryData = {
      id: 'country',
      type: 'default',
      value: 'US'
    };

    const mockCurrencyData = {
      id: 'currency',
      type: 'default',
      value: 'USD'
    };

    const mockFareData = {
      id: 'fare',
      type: 'default',
      value: 100
    };

    jest.spyOn(s3Helper, 'getJson')
      .mockResolvedValueOnce(mockCountryData)
      .mockResolvedValueOnce(mockCurrencyData)
      .mockResolvedValueOnce(mockFareData);

    jest.spyOn(dynamoDbHelper, 'putItem').mockResolvedValue(null);

    await propagateConfig(null, null, null);  // assuming the data is not propagated yet

    expect(s3Helper.getJson).toHaveBeenCalledTimes(3);
    expect(dynamoDbHelper.putItem).toHaveBeenCalledTimes(3);
    expect(dynamoDbHelper.putItem).toHaveBeenCalledWith(DynamoDBTables.FareBasicConfigTable, mockCountryData);
    expect(dynamoDbHelper.putItem).toHaveBeenCalledWith(DynamoDBTables.FareBasicConfigTable, mockCurrencyData);
    expect(dynamoDbHelper.putItem).toHaveBeenCalledWith(DynamoDBTables.FareBasicConfigTable, mockFareData);
  });
});
