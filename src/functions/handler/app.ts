import fastifySwagger from '@fastify/swagger';
import * as configHandler from '@functions/config/handler';
import * as fareHandler from '@functions/fare/handler';
import { CreateConfig, SearchConfig } from '@functions/config/types';
import Fastify from 'fastify';
import * as schemas from './schema';
import { fareConvert, fareCreate, fareDelete, fareSearch } from '@functions/fare/types';

const app = Fastify({ logger: true });

app.register(fastifySwagger, schemas.OptionsSwagger);

app.register(async function (fastify) {
    // config routes
    fastify
        .get('/config', {
            schema: schemas.configSearchSchema,
            handler: async (request, reply) => {
                const config = request?.query as SearchConfig;
                const data = await configHandler.search(config);
                return reply.code(200)
                    .header('Content-Type', 'application/json; charset=utf-8')
                    .send(JSON.stringify(data))
            }
        })
        .post('/config', {
            schema: schemas.configCreateSchema,
            handler: async (request, reply) => {
                const config = request?.body as CreateConfig;
                const data = await configHandler.create(config);
                return reply.code(200)
                    .header('Content-Type', 'application/json; charset=utf-8')
                    .send(JSON.stringify(data))
            }
        });
    // fare routes
    fastify
        .get('/fare', {
            schema: schemas.fareSearchSchema,
            handler: async (request, reply) => {
                const queryParams = request?.query as fareSearch;
                const data = await fareHandler.search(queryParams);
                return reply.code(200)
                    .header('Content-Type', 'application/json; charset=utf-8')
                    .send(JSON.stringify(data))
            }
        })
        .post('/fare', {
            schema: schemas.fareCreateSchema,
            handler: async (request, reply) => {
                const bodyParams = request?.body as fareCreate;
                const data = await fareHandler.upsert(bodyParams);
                return reply.code(200)
                    .header('Content-Type', 'application/json; charset=utf-8')
                    .send(JSON.stringify(data))
            }
        })
        .delete('/fare', {
            schema: schemas.fareDeleteSchema,
            handler: async (request, reply) => {
                const queryParams = request?.query as fareDelete;
                await fareHandler.obliterate(queryParams);
                return reply.code(200)
                    .header('Content-Type', 'application/json; charset=utf-8')
                    .send(JSON.stringify({ message: 'Fare configuration deleted' }))
            }
        })
        .post('/fare/convert', {
            schema: schemas.fareConvertSchema,
            handler: async (request, reply) => {
                const bodyParams = request?.body as fareConvert;
                const data = await fareHandler.convert(bodyParams);
                return reply.code(200)
                    .header('Content-Type', 'application/json; charset=utf-8')
                    .send(JSON.stringify(data))
            }
        });

    // propagate routes
    fastify.get('/propagate', {
        schema: schemas.propagateIntialDataSchema,
        handler: async (_request, reply) => {
            await configHandler.propagateInitialData();
            return reply.code(200)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send(JSON.stringify({ message: 'Initial data propagated' }))
        }
    });

    // docs routes
    fastify.get('/docs', {
        schema: schemas.documentationSchema,
        handler: async (_request, reply) => {
            return reply.code(200)
                .header('Content-Type', 'application/x-yaml; charset=utf-8')
                .header('Content-Disposition', 'attachment; filename="fare-formatting-service.yml"')
                .send(fastify.swagger({ yaml: true }))
        }
    });

})

export default app;
