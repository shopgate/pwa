import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import reducers from 'Pages/reducers';
import ProductsContent from '../ProductsContent';
import Empty from '../Empty';
import CategoryListContent from '../CategoryListContent';
import Content from './index';

jest.mock('@shopgate/engage/product/components/ProductFilters', () => () => null);
jest.mock('../ProductsContent', () => jest.fn(() => null));
jest.mock('../Empty', () => jest.fn(() => null));
jest.mock('../CategoryListContent', () => jest.fn(() => null));
jest.mock('../AppBar', () => () => null);

const store = createMockStore(reducers);

describe('<Content />', () => {
  it('should render', () => {
    render((
      <Provider store={store}>
        <Content categoryId="1234" />
      </Provider>
    ));

    expect(CategoryListContent.mock.lastCall[0]).toEqual({
      categoryId: '1234',
      layout: 'list',
      showImages: false,
      showAllProducts: expect.any(Boolean),
      showList: true,
    });
    expect(ProductsContent.mock.lastCall[0]).toEqual({
      categoryId: '1234',
      hasProducts: false,
    });
    expect(Empty.mock.lastCall[0]).toEqual({
      categoryId: '1234',
      headlineText: 'category.no_result.heading',
      bodyText: 'category.no_result.body',
    });
  });
});
