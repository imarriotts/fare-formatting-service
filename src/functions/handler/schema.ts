export const helloSchema = {
    querystring: {
        type: 'object',
        required: ['userId'],
        properties: {
            userId: { type: 'string' }
        }
    }
}