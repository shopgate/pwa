import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import SuggestionList from './components/SuggestionList';
import SearchField from './index';

jest.mock('@shopgate/pwa-core/classes/AppCommand');
jest.mock('@shopgate/pwa-common/actions/router', () => ({
  historyPush: jest.fn().mockReturnValue({ type: 'FOO' }),
}));
jest.mock('./components/SuggestionList');

const store = createMockStore();

const mockContext = {
  context: {
    i18n: () => ({ __: () => '' }),
  },
  childContextTypes: {
    i18n: PropTypes.func.isRequired,
  },
};

describe('<Content />', () => {
  it('should render with intial search query', () => {
    const wrapper = mount((
      <Provider store={store}>
        <SearchField pageId="1234" query="foo" />
      </Provider>), mockContext);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('input').prop('value')).toEqual('foo');
  });

  it('should show suggestions when focused', () => {
    const wrapper = mount((
      <Provider store={store}>
        <SearchField pageId="1234" query="foo" />
      </Provider>), mockContext);

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
  });

  it('should submit search', () => {
    const wrapper = mount((
      <Provider store={store}>
        <SearchField pageId="1234" query="foo" />
      </Provider>), mockContext);

    // Change serach and submit.
    wrapper.find('input').simulate('change', { target: { value: 'foo bar' } });
    wrapper.find('form').simulate('submit');
    wrapper.update();

    expect(historyPush).toHaveBeenCalledWith({
      pathname: '/search?s=foo%20bar',
    });
  });
});
