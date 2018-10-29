import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import { getSuggestions } from '@shopgate/pwa-common-commerce/search/selectors';
import SuggestionList from './index';

const store = createMockStore();

jest.mock('@shopgate/pwa-common-commerce/search/selectors', () => ({
  getSuggestions: () => ([
    'foo',
    'foo bar',
    'foo bar buz',
    'foo bar buz quz',
  ]),
}));

const mockContext = {
  context: {
    i18n: () => ({ __: () => '' }),
  },
  childContextTypes: {
    i18n: PropTypes.func.isRequired,
  },
};

describe('<SuggestionList />', () => {
  it('should render a list of suggestions', () => {
    const expectedSuggestions = getSuggestions({});

    const wrapper = mount((
      <Provider store={store}>
        <SuggestionList bottomHeight={10} onClick={() => {}} />
      </Provider>), mockContext);

    expect(wrapper).toMatchSnapshot();
    expectedSuggestions.forEach((suggestion) => {
      expect(wrapper.exists(`button[value="${suggestion}"]`)).toEqual(true);
    });
  });

  it('should call onClick with suggestion', () => {
    const onClickMock = jest.fn();
    const wrapper = mount((
      <Provider store={store}>
        <SuggestionList bottomHeight={10} onClick={onClickMock} />
      </Provider>), mockContext);

    wrapper.find('button').at(2).simulate('click');

    expect(onClickMock).toHaveBeenCalledWith(expect.anything(), 'foo bar buz');
  });
});
