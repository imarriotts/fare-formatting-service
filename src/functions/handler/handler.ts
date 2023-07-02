import awsLambdaFastify from '@fastify/aws-lambda';
import app from './app';


const proxy = awsLambdaFastify(app, { callbackWaitsForEmptyEventLoop: false });

export const main = proxy;
