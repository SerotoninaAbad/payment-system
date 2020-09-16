module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json'
    }
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  testMatch: ['**/__tests__/**/*.test.(ts|js)'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/shared/core/$1',
    '@domain/(.*)': '<rootDir>/src/shared/domain/$1',
    '@utils/(.*)': '<rootDir>/src/shared/utils/$1'
  }
};
