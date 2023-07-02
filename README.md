# Fare Formatting Service
## Table of Contents

- [API Documentation](#api-documentation)
- [Serverless Configuration](#serverless-configuration)
- [Servers](#servers)
- [Installation/deployment instructions](#installationdeployment-instructions)
- [Project Structure](#project-structure)
- [GitHub Actions CI/CD](#github-actions-cicd)
- [License](#license)
- [Afterword](#afterword)

## API Documentation

The Fare Formatting API is a serverless application built on AWS using the Serverless Framework. This API is responsible for fare formatting configuration and fare management.

### Config Endpoints

- `GET /config` : Retrieves a basic configuration. Required query parameters are `id` and `type`.

- `POST /config` : Handles the creation or updating of a basic configuration. Required body parameters are `id`, `type`, and `data`.

### Fare Endpoints

- `GET /fare` : Retrieves fare information. Required query parameters are `country` and `currency`.

- `POST /fare` : Handles the creation of fare data. Required body parameters are `country`, `currency`, and `data`.

- `DELETE /fare` : Handles the deletion of fare data. Required query parameters are `country` and `currency`.

- `POST /fare/convert` : Converts a fare. Required body parameters are `country`, `currency`, and `value`.

### Propagation Endpoint

- `GET /propagate` : Propagates the initial data to the database.

   > **Note** This API must be called before any other endpoints are called. It will upload the initial data to the database. If this endpoint is not called, the other endpoints will not work as expected.

### Documentation Endpoints

- `GET /docs` : Returns the Swagger documentation in YAML format.

For more detailed information about these endpoints (including response formats, error messages, etc.), refer to the Swagger documentation, which can be accessed by visiting the `/docs` endpoint of the API.

---
## Serverless Configuration

The Fare Formatting API service is configured to run on AWS and is defined using the Serverless Framework. The service is named 'fare-formatting-service' and the provider is AWS. It is configured to run in the 'us-east-2' region using the 'nodejs14.x' runtime.

The service is packaged individually and dev dependencies are excluded. The esbuild plugin is used for bundling and sourcemaps are enabled for better error tracking.

The service uses AWS services such as S3 and DynamoDB. It has IAM roles set up to allow necessary actions on these resources.

The environment variables are defined in the provider block of the serverless configuration file, which includes the names for the DynamoDB tables and S3 bucket. The log retention period for CloudWatch Logs is set to 1 day.

------
## Servers

- Development server: `https://ckyic0y33k.execute-api.us-east-2.amazonaws.com/dev`. Note that the URL of the development server may change if the API Gateway is redeployed. To prevent this, a custom domain could be used, but this is out of scope for this demo.

- Local server: `http://localhost:3000`


This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

## Installation/deployment instructions

> **Requirements**: NodeJS `lts/fermium`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

> You also will need an AWS account and the [AWS CLI](https://aws.amazon.com/cli/) configured in your machine.

## Installation / Deployment Instructions

1. **Clone the repository**: Clone the repository to your local machine.

    ```bash
    git clone git@github.com:imarriotts/fare-formatting-service.git
    ```

2. **Install the dependencies**: Navigate into the directory of the cloned repository and install the necessary packages.

    ```bash
    cd fare-formatting-service
    npm run install:dependencies
    ```

3. **Run Tests**: Execute unit tests to make sure everything is set up correctly.

    ```bash
    npm run test
    ```

4. **Run Lint**: Check code quality and format it.

    ```bash
    npm run lint
    ```

5. **Validate Serverless Configurations**: You can validate your serverless configurations with the following command.

    ```bash
    npm run validate
    ```

6. **Local Development**: If you want to test your application locally, you can run the serverless application offline, this will start a local server on port 3000. 

    ```bash
    npm run code:offline
    ```

> **Note**: that the AWS services will not be available locally and they will be pointing to the AWS services in the development environment.

7. **Deployment**: Deploy the application to the desired environment.

    For Development:

    ```bash
    npm run deploy:dev
    ```

    For Production:

    ```bash
    npm run deploy:prod
    ```

> **Important**: After a successful deployment, you will get an API Gateway endpoint. You can use this endpoint to access your application. Before calling any endpoint make sure to execute /propagate endpoint to propagate the initial data to the database.  

### Debugging

To start debugging in VS Code, use the `Debug Serverless Offline` configuration in `.vscode/launch.json`.

1. Start the debug process by clicking on the Run and Debug panel on the left side of VS Code, then click on the start debugging button (or press F5).

2. Set breakpoints in your code where you want the execution to pause, then send a request to your application. The code should stop at the breakpoint and you can inspect variables, the call stack, and the upcoming commands.

> **Note**: This debug configuration assumes you're using the serverless-offline plugin and have set it to run on port 3000.

## Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

```
.
├── github                           # Contains GitHub related files
│   ├── workflows                    # Contains GitHub Actions workflows
│   │   ├── deploy_dev.yml           # Contains the workflow for deploying to the development environment 
│   │   ├── deploy_prod.yml          # Contains the workflow for deploying to the production environment
├── package.json                     # Defines the project dependencies
├── .vscode                          # Contains settings for Visual Studio Code IDE
│   ├── launch.json                  # Configurations for launching and debugging the project
├── tsconfig.paths.json              # Path mapping for TypeScript modules
├── .eslintrc.json                   # Configuration for Eslint code linter
├── tsconfig.json                    # Configuration for TypeScript compiler
├── README.md                        # The file you're currently reading
├── .gitignore                       # Specifies which files should be ignored by Git
├── serverless.ts                    # Defines the Serverless service
├── .nvmrc                           # Specifies the Node.js version for Node Version Manager
├── package-lock.json                # Automatically generated file
├── src                              # The source code of the API
│   ├── functions                    # Contains the API lambda function handlers
│   │   ├── fare                     # Contains functions related to fare handling
│   │   │   ├── util.ts              # Utility functions for the fare module
│   │   │   ├── builder.ts           # Builds the responses for the fare module
│   │   │   ├── handler.ts           # The fare API lambda function
│   │   │   ├── handler.test.ts      # Tests for the fare handler function
│   │   │   ├── builder.test.ts      # Tests for the fare builder functions
│   │   │   ├── util.test.ts         # Tests for the fare utility functions
│   │   │   ├── types.ts             # TypeScript types for the fare module
│   │   ├── handler                  # The handler module
│   │   │   ├── handler.ts           # The handler function for the service
│   │   │   ├── app.ts               # The application setup
│   │   │   ├── schema.ts            # Contains JSON schema definitions
│   │   │   ├── index.ts             # Index file to export handlers
│   │   ├── services                 # Service layer
│   │   │   ├── aws                  # AWS related services
│   │   │   │   ├── constants.ts     # Constants related to AWS services
│   │   │   │   ├── s3.ts            # Interactions with AWS S3
│   │   │   │   ├── dynamodb.ts      # Interactions with AWS DynamoDB
│   │   ├── config                   # Config related functions
│   │   │   ├── util.ts              # Utility functions for the config module
│   │   │   ├── handler.ts           # Handler for config related operations
│   │   │   ├── handler.test.ts      # Tests for the config handler
│   │   │   ├── util.test.ts         # Tests for the config utility functions
│   │   │   ├── types.ts             # TypeScript types for the config module
│   │   ├── index.ts                 # Index file to export functions
│   ├── libs                         # Library code
│   │   ├── handler-resolver.ts      # Resolves handlers for routes
│   │   ├── handler-resolver.test.ts # Tests for the handler resolver
│   ├── cli                          # Command line scripts
│   │   ├── data                     # Data for initial loading
│   │   │   ├── currency.json        # Currency data
│   │   │   ├── defaultFare.json     # Default fare data
│   │   │   ├── country.json         # Country data
│   │   ├── upload-data.ts           # Script to upload initial data
│   │   ├── upload-data.test.ts      # Tests for the data upload script
├── jest.config.js                   # Configuration file for Jest testing framework
└── LICENSE                          # License file

```
## GitHub Actions CI/CD
This project uses GitHub Actions for continuous integration (CI) and continuous deployment (CD). There are two separate workflows for deploying the application to the development (dev) and production (prod) environments. 

### Deploying to Development

The development environment is updated automatically whenever changes are pushed to the `develop` branch. Before the deployment, all project tests are run to ensure the stability of the system. The steps involved in this process are:

1. Checkout the code.
2. Setup Node.js.
3. Install the project dependencies.
4. Run the tests.
5. Deploy the application to the development environment.

The workflow for this process can be found in the `.github/workflows/deploy_dev.yml` file.

### Deploying to Production

The production environment is updated automatically whenever a pull request to the `main` branch is closed and successfully merged. Like the development deployment, all project tests are run before the application is deployed. The steps involved in this process are:

1. Checkout the code.
2. Setup Node.js.
3. Install the project dependencies.
4. Run the tests.
5. Deploy the application to the production environment.

The workflow for this process can be found in the `.github/workflows/deploy_prod.yml` file.

You need to set up your AWS credentials as secrets in your GitHub repository for these workflows to run successfully. The secrets you need to set up are `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

## License
This project is licensed under the terms of the GNU GENERAL PUBLIC LICENSE Version 3. See the [LICENSE](LICENSE) file for details.


## Afterword
This project was created as a coding challenge for a job application. It was a fun project to work on and I utilized a lot of new technologies and tools. I learned a lot about AWS and the Serverless Framework. I also learned a lot about CI/CD and GitHub Actions. I hope you enjoy looking through this project as much as I enjoyed working on it.