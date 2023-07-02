export const helloSchema = {
    description: 'Hello endpoint',
    tags: ['greeting'],
    summary: 'Returns a hello message',
    querystring: {
        type: 'object',
        required: ['name'],
        properties: {
            name: { type: 'string' }
        }
    },
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        }
    }
}