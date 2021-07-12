import React from 'react';
import { mount } from 'enzyme';
import SuggestionList from './components/SuggestionList';
import SearchField from './index';
import styles from './style';

jest.mock('./components/SuggestionList', () => () => null);
jest.mock('./connector', () => cmp => cmp);

describe('pages / Browse / components / SearchField', () => {
  let submitSearch;
  let openScanner;
  let fetchSuggestions;

  // eslint-disable-next-line require-jsdoc
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
      expect(wrapper.find(`button.${styles.button}.${styles.hidden}`)).toExist();
    });

    it('should show suggestions when focused', () => {
      const wrapper = createWrapper();

      // Suggestion should not be visible when blured.
      jest.useFakeTimers();
      wrapper.find('input').simulate('focus');
      jest.runAllTimers();
      wrapper.update();

      // Should be rendered now with current query.
      expect(wrapper).toMatchSnapshot();

      expect(wrapper.find(SuggestionList).prop('searchPhrase')).toEqual('foo');
      expect(wrapper.find(`button.${styles.scannerIcon}`)).not.toExist();
      // Reset button should be visible
      expect(wrapper.find(`button.${styles.button}`)).toExist();
      expect(wrapper.find(`button.${styles.button}.${styles.hidden}`)).not.toExist();
    });

    it('should submit search', () => {
      const wrapper = createWrapper({ submitSearch });

      // Change search and submit.
      wrapper.find('input').simulate('change', { target: { value: 'foo bar' } });
      wrapper.find('form').simulate('submit');
      wrapper.update();

      expect(submitSearch).toHaveBeenCalledWith('foo bar');
    });
  });

  describe('Check scanner icon and action', () => {
    it('should not render when the scanner is not supported', () => {
      const wrapper = createWrapper();
      expect(wrapper.find(`button.${styles.scannerIcon}`)).not.toExist();
    });

    it('should open the scanner', () => {
      const wrapper = createWrapper({
        showScannerIcon: true,
      });
      expect(wrapper.find(`button.${styles.scannerIcon}`)).toExist();
      wrapper.find(`button.${styles.scannerIcon}`).simulate('click');
      expect(openScanner).toHaveBeenCalledTimes(1);
    });
  });
});
