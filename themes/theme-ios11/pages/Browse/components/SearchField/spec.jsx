import React from 'react';
import { mount } from 'enzyme';
import SuggestionList from './components/SuggestionList';
import SearchField from './index';

jest.mock('@virtuous/conductor', () => ({
  router: {
    update: jest.fn(),
  },
}));
jest.mock('@shopgate/engage/components', () => {
  const Input = jest.requireActual('@shopgate/pwa-common/components/Input');

  return {
    I18n: {
      Text: () => 'I18n.Text',
      Placeholder: () => null,
      Price: () => null,
    },
    Input: Input.default,
    SurroundPortals: ({ children }) => children,
    MagnifierIcon: () => null,
    BarcodeScannerIcon: () => null,
  };
});
jest.mock('./components/SuggestionList', () => () => null);
jest.mock('./connector', () => cmp => cmp);

describe('pages / Browse / components / SearchField', () => {
  let submitSearch;
  let openScanner;
  let fetchSuggestions;

  const createWrapper = props => mount((
    <SearchField
      pageId="1234"
      query="foo"
      fetchSuggestions={fetchSuggestions}
      openScanner={openScanner}
      submitSearch={submitSearch}
      showScannerIcon={false}
      {...props}
    />
  ));

  beforeEach(() => {
    jest.clearAllMocks();
    submitSearch = jest.fn();
    fetchSuggestions = jest.fn();
    openScanner = jest.fn();
  });

  describe('Check search field', () => {
    it('should render with initial search query', () => {
      const wrapper = createWrapper();
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('input').prop('value')).toEqual('foo');
      // Reset button should be initially hidden
      expect(wrapper.find('[data-test-id="search-field-cancel"]').prop('aria-hidden')).toBe(true);
    });

    it('should show suggestions when focused', () => {
      const wrapper = createWrapper();

      // Suggestion should not be visible when blurred.
      jest.useFakeTimers();
      wrapper.find('input').simulate('focus');
      jest.runAllTimers();
      wrapper.update();

      // Should be rendered now with current query.
      expect(wrapper).toMatchSnapshot();

      expect(wrapper.find(SuggestionList).prop('searchPhrase')).toEqual('foo');
      expect(wrapper.find('[data-test-id="search-field-scanner"]').exists()).toBe(false);
      // Reset button should be visible
      expect(wrapper.find('[data-test-id="search-field-cancel"]').prop('aria-hidden')).toBe(false);
    });

    it('should submit search', () => {
      jest.useFakeTimers();
      const wrapper = createWrapper({ submitSearch });

      // Change search and submit.
      wrapper.find('input').simulate('change', { target: { value: 'foo bar' } });
      wrapper.find('form').simulate('submit');
      jest.runAllTimers();
      wrapper.update();

      expect(submitSearch).toHaveBeenCalledWith('foo bar');
      jest.useRealTimers();
    });
  });

  describe('Check scanner icon and action', () => {
    it('should not render when the scanner is not supported', () => {
      const wrapper = createWrapper();
      expect(wrapper.find('[data-test-id="search-field-scanner"]').exists()).toBe(false);
    });

    it('should open the scanner', () => {
      const wrapper = createWrapper({
        showScannerIcon: true,
      });
      expect(wrapper.find('[data-test-id="search-field-scanner"]').exists()).toBe(true);
      wrapper.find('[data-test-id="search-field-scanner"]').simulate('click');
      expect(openScanner).toHaveBeenCalledTimes(1);
    });
  });
});
