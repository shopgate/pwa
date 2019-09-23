import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import SearchField from '../SearchField';
import Content from './index';

const store = createMockStore();

jest.mock('../SearchField');
jest.mock('../RootCategories');
jest.mock('Components/AppBar/presets', () => ({
  BackBar: () => <div />,
}));

const mockContext = {
  context: {
    i18n: () => ({ __: () => '' }),
  },
  childContextTypes: {
    i18n: PropTypes.func.isRequired,
  },
};

describe('<Content />', () => {
  it('should render', () => {
    const wrapper = mount((
      <Provider store={store}>
        <Content pageId="1234" query="foo" />
      </Provider>), mockContext);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(SearchField).props()).toEqual({
      pageId: '1234',
      query: 'foo',
    });
  });
});
