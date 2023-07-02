import { s3Helper } from '@functions/services/aws/s3';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
jest.mock('fs');
jest.mock('@functions/services/aws/s3');

describe('Script Test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should upload the files to S3', async () => {
        // Mock environment variable
        process.env.STAGE = 'test';

        // Mock readFileSync to return a string
        (fs.readFileSync as jest.Mock).mockImplementation(() => JSON.stringify({ data: 'test data' }));

        // Mock uploadJson to simply return
        (s3Helper.uploadJson as jest.Mock).mockImplementation(() => Promise.resolve());

        require('./upload-data.ts');

        // Check if readFileSync was called with correct parameters
        expect(fs.readFileSync).toHaveBeenCalledWith(path.join(__dirname, 'data/country.json'), 'utf8');
        expect(fs.readFileSync).toHaveBeenCalledWith(path.join(__dirname, 'data/currency.json'), 'utf8');
        expect(fs.readFileSync).toHaveBeenCalledWith(path.join(__dirname, 'data/defaultFare.json'), 'utf8');

        // Check if uploadJson was called with correct parameters
        expect(s3Helper.uploadJson).toHaveBeenCalledTimes(3); 
    });
});
