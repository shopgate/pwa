const Enzyme = require('enzyme');
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');

Enzyme.configure({ adapter: new Adapter() });

/**
 * Checks whether a module can be resolved. Consumers of this package don't necessarily have all
 * of the mocked packages installed, and jest.mock() resolves the module path even when a factory
 * is passed, so mocking an absent module would break the whole setup.
 * @param {string} modulePath Path of the module.
 * @returns {boolean} Whether the module can be resolved.
 */
const canResolve = (modulePath) => {
  try {
    require.resolve(modulePath);
    return true;
  } catch (e) {
    return false;
  }
};

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
if (canResolve('@shopgate/engage/core/helpers/i18n')) {
  jest.mock('@shopgate/engage/core/helpers/i18n', () => require('./mocks/i18n'));
}

// Mock the AppCommand class by default to avoid log spamming during test runs
if (canResolve('@shopgate/pwa-core/classes/AppCommand')) {
  jest.mock('@shopgate/pwa-core/classes/AppCommand', () => require('./mocks/appCommand'));
}

// Mock the useTheme hook to prevent failing tests due to missing theme object
if (canResolve('@shopgate/engage/styles/theme/hooks/useTheme')) {
  jest.mock('@shopgate/engage/styles/theme/hooks/useTheme', () => require('./mocks/useTheme'));
}

// Mock the media provider styles to prevent failing tests
if (canResolve('@shopgate/pwa-common/collections/media-providers/style')) {
  jest.mock('@shopgate/pwa-common/collections/media-providers/style', () => ({
    responsiveContainer: 'responsiveContainer',
    consentContainer: 'consentContainer',
    consentLink: 'consentLink',
    consentIcon: 'consentIcon',
  }));
}

// The themes are not installed for consumers like extensions. They can't be mocked virtually,
// since a virtual mock is only applied to imports which use this exact module path.
if (canResolve('@shopgate/theme-gmd/extensions/reducers')) {
  jest.mock('@shopgate/theme-gmd/extensions/reducers', () => null);
}

if (canResolve('@shopgate/theme-ios11/extensions/reducers')) {
  jest.mock('@shopgate/theme-ios11/extensions/reducers', () => null);
}
/* eslint-enable global-require */

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
