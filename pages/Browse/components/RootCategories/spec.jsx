import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import { getRootCategories } from '@shopgate/pwa-common-commerce/category/selectors';
import RootCategories from './index';

const store = createMockStore();

jest.mock('@shopgate/pwa-common-commerce/category/selectors', () => ({
  getRootCategories: () => ([
    { id: '123-123', name: 'foo' },
    { id: '456-123', name: 'bar' },
    { id: '789-123', name: 'baz' },
    { id: '789-456', name: 'qux' },
  ]),
}));
jest.mock('Components/Headline', () => function Headline() { return null; });
jest.mock('@shopgate/engage/components', () => {
  // eslint-disable-next-line require-jsdoc
  function SheetList({ children }) { return children; }
  SheetList.Item = function Item() { return null; };

  return {
    SheetList,
    Image: () => null,
    TextLink: () => null,
  };
});

const mockContext = {
  context: {
    i18n: () => ({ __: () => '' }),
  },
  childContextTypes: {
    i18n: PropTypes.func.isRequired,
  },
};

describe('<RootCategories />', () => {
  it('should render category list with root categories from store', () => {
    const expectedRootCategories = getRootCategories({});

    const wrapper = mount((
      <Provider store={store}>
        <RootCategories />
      </Provider>), mockContext);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('CategoryList').prop('categories')).toEqual(expectedRootCategories);
  });
});
