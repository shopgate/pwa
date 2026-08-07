const Enzyme = require('enzyme');
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');

Enzyme.configure({ adapter: new Adapter() });

/**
 * The mocks below are provided by this package instead of relying on the manual __mocks__ folders
 * of the mocked packages. Those folders are stripped from the published packages, so consumers
 * like extensions would silently fall back to automocks, which breaks as soon as a component from
 * @shopgate/engage is imported.
 *
 * The mock factories have to require their module lazily and inline, which is enforced by
 * babel-plugin-jest-hoist.
 */
/* eslint-disable global-require */

// Mock the translation helpers, since they are not initialized during test runs
jest.mock('@shopgate/engage/core/helpers/i18n', () => require('./mocks/i18n'));

const localStorageMock = (() => {
  let store = {};

  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock the AppCommand class by default to avoid log spamming during test runs
jest.mock('@shopgate/pwa-core/classes/AppCommand', () => require('./mocks/appCommand'));

// Mock the extension reducers of the themes when they are available. Consumers like extensions
// don't have the themes installed, where resolving them would throw. They can't be mocked
// virtually, since a virtual mock is only applied to imports which use this exact module path.
[
  '@shopgate/theme-gmd/extensions/reducers',
  '@shopgate/theme-ios11/extensions/reducers',
].forEach((modulePath) => {
  try {
    require.resolve(modulePath);
  } catch (e) {
    return;
  }

  jest.mock(modulePath, () => null);
});

// Mock the media provider styles to prevent failing tests
jest.mock('@shopgate/pwa-common/collections/media-providers/style', () => ({
  responsiveContainer: 'responsiveContainer',
  consentContainer: 'consentContainer',
  consentLink: 'consentLink',
  consentIcon: 'consentIcon',
}));

// Mock the useTheme hook to prevent failing tests due to missing theme object
jest.mock('@shopgate/engage/styles/theme/hooks/useTheme', () => require('./mocks/useTheme'));
/* eslint-enable global-require */
