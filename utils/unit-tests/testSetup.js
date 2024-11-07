const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

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
