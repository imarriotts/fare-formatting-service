import type { AWS } from '@serverless/typescript';

import handler from '@functions/handler';

const serverlessConfiguration: AWS = {
  service: 'fare-formatting-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    apiName: 'fare-formatting-service',
    stage: '${opt:stage, "dev"}',
    name: 'aws',
    region: 'us-east-2',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['s3:ListBucket'],
            Resource: '*',
          },
          {
            Effect: 'Allow',
            Action: ['s3:GetObject', 's3:PutObject'],
            Resource: [
              'arn:aws:s3:::fare-bucket/*',
            ],
          },
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:PutItem',
              'dynamodb:DeleteItem',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:Query',
              'dynamodb:BatchGetItem',
              'dynamodb:UpdateItem',
            ],
            Resource: [
              'arn:aws:dynamodb:*:${aws:accountId}:table/${self:provider.stage}-*',
            ],
          }
        ]
      }
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      FARE_BASIC_CONFIG_TABLE: '${self:provider.stage}-fare-basic-config',
      FARE_COUNTRY_CONFIG_TABLE: '${self:provider.stage}-fare-country-config',
      FARE_BUCKET: '${self:provider.stage}-fare-bucket',
    },
    logRetentionInDays: 1,
  },
  resources: {
    Resources: {
      FareBasicConfigTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:provider.environment.FARE_BASIC_CONFIG_TABLE}',
          AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' },
            { AttributeName: 'type', AttributeType: 'S' },
          ],
          KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' },
            { AttributeName: 'type', KeyType: 'RANGE' },
          ],
          BillingMode: 'PAY_PER_REQUEST',
        }
      },
      FareCountryConfigTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:provider.environment.FARE_COUNTRY_CONFIG_TABLE}',
          AttributeDefinitions: [
            { AttributeName: 'country', AttributeType: 'S' },
            { AttributeName: 'currency', AttributeType: 'S' }
          ],
          KeySchema: [
            { AttributeName: 'country', KeyType: 'HASH' },
            { AttributeName: 'currency', KeyType: 'RANGE' }
          ],
          BillingMode: 'PAY_PER_REQUEST',
        }
      },
      FareBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${self:provider.environment.FARE_BUCKET}',
        }
      }
    },
    Outputs: {
      ApiUrl: {
        Value: {
          'Fn::Join': [
            '',
            [
              'https://',
              { Ref: 'ApiGatewayRestApi' },
              '.execute-api.',
              { Ref: 'AWS::Region' },
              '.',
              { Ref: 'AWS::URLSuffix' },
              '/${self:provider.stage}',
            ],
          ],
        },
      },
    }
  },
  functions: { handler },
  package: { individually: true, excludeDevDependencies: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
