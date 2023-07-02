import Fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';

const app = Fastify({ logger: true });

app.register(fastifySwagger, {
    mode: 'dynamic',
    openapi: {
        info: { title: 'Test swagger', description: 'Testing the Fastify swagger API', version: '0.1.0' },
    },
});

app.register(async function (fastify) {
    fastify.get('/hello', {
        schema: {
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
        },
        handler: async (request, reply) => {
            const { name = 'Guest' } = request?.query as any;
            return reply.send({ "message": `Hello, my name is ${name}` });
        }
    })

    fastify.get('/bye', {
        schema: {
            description: 'Bye endpoint',
            tags: ['greeting'],
            summary: 'Returns a bye message',
            response: {
                200: {
                    description: 'Successful response',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        },
        handler: async (request, reply) => {
            const { name = 'Guest' } = request?.query as any;
            return reply.send({ "message": `Bye ${name}` });
        }
    })

    fastify.get('/docs', {
        schema: {
            description: 'Swagger endpoint',
            tags: ['documentation'],
            summary: 'Returns the swagger documentation',
        }, handler: async (_request, reply) => {
            return reply.send(fastify.swagger({ yaml: true }))
        }
    })
})

export default app;
