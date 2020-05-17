module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
  ],
  rootDir: './src',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testRegex: ['.(test|spec).ts$'],
  coverageDirectory: '../coverage',
  verbose: true,
  bail: true,
  testPathIgnorePatterns: [
    './node_modules/',
  ],
  preset: 'jest-puppeteer',
};
