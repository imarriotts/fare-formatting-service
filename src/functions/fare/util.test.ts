import * as dynamoDbHelper from "@functions/services/aws/dynamodb";
import { checkFareInput } from "./util";

describe('checkFareInput function', () => {

    it('should throw an error if the country or currency is invalid', async () => {
        jest.spyOn(dynamoDbHelper, 'getItem').mockResolvedValue({ data: [] } as any)

        await expect(checkFareInput('US', 'USD')).rejects.toThrow('Invalid country or currency');
    });

    it('should not throw an error if the country and currency are valid', async () => {
        jest.spyOn(dynamoDbHelper, 'getItem').mockResolvedValue({
            data: [
                { countryCode: 'US', currencyCode: 'USD' }
            ]
        } as any)
        // If the function does not throw an error, the test will pass
        await checkFareInput('US', 'USD');
    });
});
