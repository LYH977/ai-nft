const nextJest = require('next/jest')
const createJestConfig = nextJest({
  dir: './',
  silent: true,
})
/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
