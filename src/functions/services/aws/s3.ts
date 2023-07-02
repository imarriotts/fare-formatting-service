import * as AWS from 'aws-sdk'; 

const s3 = new AWS.S3();

export const s3Helper = {
    async uploadJson(bucket: string, key: string, json: object): Promise<void> {
        const params = {
            Bucket: bucket,
            Key: key,
            Body: JSON.stringify(json),
            ContentType: 'application/json'
        };

        await s3.putObject(params).promise();
    },

    async getJson(bucket: string, key: string): Promise<object | null> {
        try {
            const params = {
                Bucket: bucket,
                Key: key
            };

            const data = await s3.getObject(params).promise();

            if (data.Body) {
                return JSON.parse(data.Body.toString());
            } else {
                return null;
            }
        } catch (error) {
            if (error.code === 'NoSuchKey') {
                return null;
            } else {
                throw error;
            }
        }
    },

    async uploadYaml(bucket: string, key: string, yamlString: string): Promise<void> {
        const params = {
            Bucket: bucket,
            Key: key,
            Body: yamlString,
            ContentType: 'application/x-yaml'
        };

        await s3.putObject(params).promise();
    },

    async getYaml(bucket: string, key: string): Promise<string | null> {
        try {
            const params = {
                Bucket: bucket,
                Key: key
            };

            const data = await s3.getObject(params).promise();

            if (data.Body) {
                return data.Body.toString();
            } else {
                return null;
            }
        } catch (error) {
            if (error.code === 'NoSuchKey') {
                return null;
            } else {
                throw error;
            }
        }
    }
};
