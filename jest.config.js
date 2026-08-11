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
  '@shopgate-theme-config',
];

module.exports = {
  ...jestConfig,
  // Ensure Jest recognizes and loads .mjs files
  moduleFileExtensions: [
    ...(jestConfig.moduleFileExtensions || []),
    'mjs',
  ],
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
  transform: {
    // Transpile JS/TS files
    '^.+\\.[jt]sx?$': 'babel-jest',
    // Also transpile .mjs files from dependencies like swiper
    '^.+\\.mjs$': 'babel-jest',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/themes/*/extensions/',
    '/themes/*/e2e/',
    `/extensions/(?!(${testedExtensions.join('|')}))`,
    '/utils/webpack/local-packages',
    '/dist/',
    '.*/dist/.*',
    ...skipPatterns,
  ],
  transformIgnorePatterns: [
    // Spread the defaults, since they would be replaced otherwise
    ...jestConfig.transformIgnorePatterns,
    '/themes/*/extensions/',
    '/themes/*/e2e/',
    '/dist/',
  ],
  moduleNameMapper: {
    // Spread the defaults, since they would be replaced otherwise. They already cover styles,
    // assets and the swiper mappings.
    ...jestConfig.moduleNameMapper,
  },
  modulePathIgnorePatterns: [
    '<rootDir>/.*/dist/.*',
  ],
};
