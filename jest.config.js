const nextJest = require('next/jest')
const createJestConfig = nextJest({
  dir: './',
  silent: true,
})
/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  coveragePathIgnorePatterns: ['mockData.ts', 'constants.ts'],
}

module.exports = createJestConfig(customJestConfig)
