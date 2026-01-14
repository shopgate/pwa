const jestConfig = require('@shopgate/pwa-unit-test/jest.config');

const fs = require('fs');
const path = require('path');

const engageRoot = path.join(__dirname, 'libraries', 'engage');

// Collect all immediate subfolders inside /libraries/engage
let engagePackages = [];
try {
  engagePackages = fs
    .readdirSync(engageRoot)
    .filter(name => fs.statSync(path.join(engageRoot, name)).isDirectory());
} catch {
  engagePackages = [];
}

// Build a regex to match only: libraries/engage/<package>/index.spec.js(x)
// Used to skip these tests when RUN_LONG is not set
const skippedIndexSpecPattern =
  `libraries[\\\\/]engage[\\\\/](?:${engagePackages.join('|')})[\\\\/]index\\.spec\\.(js|jsx)$`;

// Only skip these tests when RUN_LONG is NOT set
const skipPatterns = process.env.RUN_LONG === 'true'
  ? [] // run everything
  : [skippedIndexSpecPattern];

const testedExtensions = [
  '@shopgate-tracking-ga-native',
  '@shopgate-product-reviews',
  '@shopgate-user-privacy',
  '@shopgate-theme-config',
];

module.exports = Object.assign({}, jestConfig, {
  collectCoverageFrom: [
    'extensions/*/frontend/**/*.{js,jsx}',
    'libraries/*/**/*.{js,jsx}',
    'themes/*/**/*.{js,jsx}',
    '!*/**/.eslintrc.js',
    '!*/**/jest.config.js',
    '!themes/*/extensions/**/*.js',
    '!themes/*/e2e/**/*.js',
    '!**/dist/**',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/themes/*/extensions/',
    '/themes/*/e2e/',
    `/extensions/(?!(${testedExtensions.join('|')}))`,
    '/dist/',
    '.*/dist/.*',
    ...skipPatterns,
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(swiper|dom7)/)',
    '/themes/*/extensions/',
    '/themes/*/e2e/',
    '/dist/',
  ],
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/fileMock.js',
    // Fix issue with Swiper ES module imports that work via "exports" field in package.json
    '^swiper/react$': '<rootDir>/node_modules/swiper/swiper-react.mjs',
    // Mock Swiper styles since they are not needed for unit tests
    '^swiper/css(?:/.*)?$': '<rootDir>/__mocks__/styleMock.js',
  },
  modulePathIgnorePatterns: [
    '<rootDir>/.*/dist/.*',
  ],
});
