import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { mockThemeConfig } from '@shopgate/pwa-common/helpers/config/mock';
import { createMockStore } from '@shopgate/pwa-common/store';
import {
  SCANNER_SCOPE_DEFAULT,
  SCANNER_TYPE_BARCODE,
} from '@shopgate/pwa-core/constants/Scanner';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import { hasScannerSupport } from '@shopgate/pwa-common/selectors/client';
import { getScannerRoute } from '@shopgate/pwa-common-commerce/scanner/helpers';
import SuggestionList from './components/SuggestionList';
import styles from './style';

jest.mock('@shopgate/engage/core/helpers/i18n', () => ({
  i18n: {
    text: () => '',
    ready: true,
  },
}));

jest.mock('@shopgate/pwa-core/classes/AppCommand');
jest.mock('@virtuous/conductor', () => ({
  router: {
    update: jest.fn(),
  },
}));
jest.mock('@shopgate/pwa-common/actions/router', () => ({
  historyPush: jest.fn().mockReturnValue({ type: 'FOO' }),
}));
jest.mock('./components/SuggestionList', () => () => null);

jest.mock('@shopgate/pwa-common/selectors/client', () => ({
  hasScannerSupport: jest.fn().mockReturnValue(true),
}));

let mockHasNoScanner = false;
let mockShowSearchFieldIcon = true;
jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  get hasNoScanner() { return mockHasNoScanner; },
  get scanner() { return { showSearchFieldIcon: mockShowSearchFieldIcon }; },
  themeConfig: {
    colors: {
      accent: '',
    },
    variables: {
      gap: {},
    },
    icons: mockThemeConfig.icons,
  },
}));

const store = createMockStore();

/**
 * @return {JSX}
 */
const createWrapper = () => {
  // Because we mock appConfig, we need import component in test runtime
  // eslint-disable-next-line global-require
  const SearchField = require('./index').default;
  return mount((
    <Provider store={store}>
      <SearchField pageId="1234" query="foo" />
    </Provider>));
};

describe('<Content />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Check search field', () => {
    it('should render with initial search query', () => {
      const wrapper = createWrapper();
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('input').prop('value')).toEqual('foo');
    });

    it('should render with the scanner icon when the scanner is enabled and supported', () => {
      const wrapper = createWrapper();
      expect(wrapper.find(`button.${styles.scannerIcon}`)).toExist();
    });

    it('should show suggestions when focused', () => {
      const wrapper = createWrapper();

      // Suggestion should not be visible when blured.
      expect(wrapper.find(SuggestionList).length).toEqual(0);
      jest.useFakeTimers();
      wrapper.find('input').simulate('focus');
      jest.runAllTimers();
      wrapper.update();

      // Should be rendered now with current query.
      expect(wrapper).toMatchSnapshot();

      expect(wrapper.find(SuggestionList).length).toEqual(1);
      expect(wrapper.find(SuggestionList).prop('searchPhrase')).toEqual('foo');
      expect(wrapper.find(`button.${styles.scannerIcon}`)).not.toExist();
    });

    it('should submit search', () => {
      const wrapper = createWrapper();

      // Change search and submit.
      wrapper.find('input').simulate('change', { target: { value: 'foo bar' } });
      wrapper.find('form').simulate('submit');
      wrapper.update();

      expect(historyPush).toHaveBeenCalledWith({
        pathname: '/search?s=foo%20bar',
      });
    });
  });

  describe('Check scanner icon and action', () => {
    it('should open the scanner', () => {
      const wrapper = createWrapper();
      expect(wrapper.find(`button.${styles.scannerIcon}`)).toExist();
      wrapper.find(`button.${styles.scannerIcon}`).simulate('click');
      expect(historyPush).toHaveBeenCalledWith({
        pathname: getScannerRoute(SCANNER_SCOPE_DEFAULT, SCANNER_TYPE_BARCODE),
        title: 'navigation.scanner',
      });
    });
    it('should not render when the scanner is not supported', () => {
      hasScannerSupport.mockReturnValue(false);
      const wrapper = createWrapper();
      expect(wrapper.find(`button.${styles.scannerIcon}`)).not.toExist();
    });

    it('should not render when the scanner is not enabled', () => {
      mockHasNoScanner = true;
      const wrapper = createWrapper();
      expect(wrapper.find(`button.${styles.scannerIcon}`)).not.toExist();
    });

    it('should not render when icon is off', () => {
      mockShowSearchFieldIcon = false;
      const wrapper = createWrapper();
      expect(wrapper.find(`button.${styles.scannerIcon}`)).not.toExist();
    });
  });
});
