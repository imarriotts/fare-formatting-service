import { SwaggerOptions } from "@fastify/swagger"
import { FastifyRegisterOptions } from "fastify"

export const OptionsSwagger: FastifyRegisterOptions<SwaggerOptions> = {
    mode: 'dynamic',
    openapi: {
        info:
        {
            title: `Fare Formatting API`,
            description: `This is a simple API to format a fare based on country and currency`,
            version: '1.0.0'
        },
        servers: [
            {
                url: 'https://ckyic0y33k.execute-api.us-east-2.amazonaws.com/dev',
                description: 'Development server, this will change if we redeploy the API Gateway, to avoid this we can use a custom domain, but this is out of scope for this demo'
            },
            {
                url: 'http://localhost:3000',
                description: 'Local server'
            }
        ],
        tags: [
            {
                name: 'documentation',
                description: 'Documentation endpoints',
            },
            {
                name: 'config',
                description: 'Config endpoints',
            },
            {
                name: 'fare',
                description: 'Fare endpoints',
            },
        ],
    },
}

export const configSearchSchema = {
    description: `Config endpoint`,
    tags: ['config'],
    summary: 'Handles basic config',
    querystring: {
        type: 'object',
        required: ['id', 'type'],
        properties: {
            id: { type: 'string' },
            type: { type: 'string' }
        }
    },
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
        }
    }
}

export const configCreateSchema = {
    description: `Config endpoint`,
    tags: ['config'],
    summary: 'Handles basic config',
    body: {
        type: 'object',
        required: ['id', 'type', 'data'],
        properties: {
            id: { type: 'string' },
            type: { type: 'string' },
            data: { type: 'object' }
        }
    },
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
            properties: {
                id: { type: 'string' },
                type: { type: 'string' },
                data: { type: 'object' }
            }
        }
    }
}

export const documentationSchema = {
    description: 'Swagger endpoint',
    tags: ['documentation'],
    summary: 'Returns the swagger documentation in yml format',
}

export const fareSearchSchema = {
    description: `Fare Search endpoint`,
    tags: ['fare'],
    summary: 'Handles Fare Search',
    querystring: {
        type: 'object',
        required: ['country', 'currency'],
        properties: {
            country: { type: 'string' },
            currency: { type: 'string' }
        }
    },
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
        }
    }
}

export const fareDeleteSchema = {
    description: `Fare Delete endpoint`,
    tags: ['fare'],
    summary: 'Handles Fare Deletion',
    querystring: {
        type: 'object',
        required: ['country', 'currency'],
        properties: {
            country: { type: 'string' },
            currency: { type: 'string' }
        }
    },
    response: {
        204: {
            description: 'Successful response',
            type: 'object',
        }
    }
}

export const fareCreateSchema = {
    description: `Fare Create endpoint`,
    tags: ['fare'],
    summary: 'Handles fare creation',
    body: {
        type: 'object',
        properties: {
            country: { type: 'string' },
            currency: { type: 'string' },
            data: {
                type: 'object',
                properties: {
                    currencyCode: { type: 'string' },
                    currencySymbol: { type: 'string' },
                    displayAfter: { type: 'boolean' },
                    displayCents: { type: 'boolean' },
                    displayFormat: {
                        type: 'string',
                        enum: ['#,###.##', '#.###,##']
                    },
                    useCurrencyCode: { type: 'boolean' }
                },
                required: ['currencyCode', 'currencySymbol', 'displayAfter', 'displayCents', 'displayFormat', 'useCurrencyCode']
            }
        },
        required: ['country', 'currency', 'data']
    },
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
            properties: {
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        country: { type: 'string' },
                        currency: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                currencyCode: { type: 'string' },
                                currencySymbol: { type: 'string' },
                                displayAfter: { type: 'boolean' },
                                displayCents: { type: 'boolean' },
                                displayFormat: {
                                    type: 'string',
                                    enum: ['#,###.##', '#.###,##']
                                },
                                useCurrencyCode: { type: 'boolean' }
                            }
                        }
                    }
                }
            }
        }
    }
}

export const fareConvertSchema = {
    description: `Fare Convert endpoint`,
    tags: ['fare'],
    summary: 'Handles fare conversion',
    body: {
        type: 'object',
        properties: {
            country: { type: 'string' },
            currency: { type: 'string' },
            value: { type: 'number' }
        },
        required: ['country', 'currency', 'value']
    },
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
            properties: {
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        country: { type: 'string' },
                        currency: { type: 'string' },
                        value: { type: 'number' },
                        formatted: { type: 'string' }
                    }
                }
            }
        }
    }
}

export const propagateIntialDataSchema = {
    description: `Propagate Intial Data endpoint`,
    tags: ['documentation'],
    summary: 'Propagates the initial data to the database',
    response: {
        200: {
            description: 'Successful response,',
            type: 'object',
            properties: {
                message: { type: 'string' },
            }
        },
        500: {
            description: 'Internal server error, This is a one time operation, once is done, this endpoint will return an error',
            type: 'object',
            properties: {
                statusCode: { type: 'number' },
                error: { type: 'string' },
                message: { type: 'string' },
            },
        },
    },
}
