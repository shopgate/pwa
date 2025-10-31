const jestConfig = require('@shopgate/pwa-unit-test/jest.config');

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
    '^swiper/react$': '<rootDir>/node_modules/swiper/swiper-react.mjs',
    '^swiper/css': '<rootDir>/__mocks__/styleMock.js',
    '^swiper/a11y': '<rootDir>/__mocks__/styleMock.js',
    '^swiper/pagination': '<rootDir>/__mocks__/styleMock.js',
    '^swiper/navigation': '<rootDir>/__mocks__/styleMock.js',
    '^swiper/zoom': '<rootDir>/__mocks__/styleMock.js',
  },
  modulePathIgnorePatterns: [
    '<rootDir>/.*/dist/.*',
  ],
});
