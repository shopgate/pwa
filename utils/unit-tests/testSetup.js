const Enzyme = require('enzyme');
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');

Enzyme.configure({ adapter: new Adapter() });

jest.mock('@shopgate/engage/core/helpers/i18n');

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
jest.mock('@shopgate/pwa-core/classes/AppCommand');
jest.mock('@shopgate/theme-gmd/extensions/reducers', () => null);
jest.mock('@shopgate/theme-ios11/extensions/reducers', () => null);

// Mock the media provider styles to prevent failing tests
jest.mock('@shopgate/pwa-common/collections/media-providers/style', () => ({
  responsiveContainer: 'responsiveContainer',
  consentContainer: 'consentContainer',
  consentLink: 'consentLink',
  consentIcon: 'consentIcon',
}));

// Mock the useTheme hook to prevent failing tests due to missing theme object
jest.mock('@shopgate/engage/styles/theme/hooks/useTheme');

// jsdom doesn't implement matchMedia. Components that check media queries - the `useReduceMotion`
// hook behind every v2 button, breakpoint providers - would throw in every spec that renders them.
// Specs that care about the result can still override this with their own stub.
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  });
}
