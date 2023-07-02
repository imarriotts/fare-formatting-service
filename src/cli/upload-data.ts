#!/usr/bin/env ts-node

import { s3Helper } from '@functions/services/aws/s3';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const COUNTRY_FILE = 'country.json';
const CURRENCY_FILE = 'currency.json';
const FARE_FILE = 'defaultFare.json';

const main = async () => {
    // getts the stage from the environment variables
    const stage = process.env.STAGE || 'dev';

    console.log(`Uploading data to ${stage} stage`);

    // the bucket name is the stage + fare-bucket
    const bucketName = `${stage}-fare-bucket`

    // read the data from the files
    const countryData = fs.readFileSync(path.join(__dirname, `data/${COUNTRY_FILE}`), 'utf8');
    const currencyData = fs.readFileSync(path.join(__dirname, `data/${CURRENCY_FILE}`), 'utf8');
    const fareData = fs.readFileSync(path.join(__dirname, `data/${FARE_FILE}`), 'utf8');

    // upload the data to the bucket
    await Promise.all([
        s3Helper.uploadJson(bucketName, COUNTRY_FILE, JSON.parse(countryData)),
        s3Helper.uploadJson(bucketName, CURRENCY_FILE, JSON.parse(currencyData)),
        s3Helper.uploadJson(bucketName, FARE_FILE, JSON.parse(fareData))
    ])
    console.log('Data uploaded successfully');
};

main().catch((error) => {
    console.error('An error occurred:', error);
    process.exit(1);
});
