import AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient();

export const dynamoDbHelper = {
    async getItem(tableName: string, key: any) {
        const params = {
            TableName: tableName,
            Key: key
        };

        const data = await docClient.get(params).promise();

        return data.Item;
    },

    async putItem(tableName: string, item: any) {
        const params = {
            TableName: tableName,
            Item: item
        };

        await docClient.put(params).promise();

        return item;
    },

    async deleteItem(tableName: string, key: any) {
        const params = {
            TableName: tableName,
            Key: key
        };

        await docClient.delete(params).promise();
    },

    async queryItems(tableName: string, keyCondition: { [key: string]: string | number }) {
        const params = {
            TableName: tableName,
            KeyConditionExpression: Object.keys(keyCondition).map(key => `#${key} = :${key}`).join(' and '),
            ExpressionAttributeNames: Object.fromEntries(Object.entries(keyCondition).map(([key]) => [`#${key}`, key])),
            ExpressionAttributeValues: Object.fromEntries(Object.entries(keyCondition).map(([key, value]) => [`:${key}`, value])),
        };

        try {
            const data = await docClient.query(params).promise();
            return data.Items as any[] ?? [];
        } catch (error) {
            console.error(`Failed to query items from ${tableName}: ${error}`);
            throw error;
        }
    }
};
