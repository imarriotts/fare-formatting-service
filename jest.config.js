module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@functions/(.*)$': '<rootDir>/src/functions/$1',
    }
}
