module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: [
    '<rootDir>/.nuxt/',
    '<rootDir>/node_modules/',
    '<rootDir>/.output/',
  ]
};