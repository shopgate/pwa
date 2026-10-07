/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import { hasCategoryChildren } from '@shopgate/engage/category/selectors';
import { CategoryList } from '@shopgate/engage/category/components';
import reducers from 'Pages/reducers';
import CategoryListContent from './index';

const store = createMockStore(reducers);

jest.mock('@shopgate/pwa-common-commerce/category/selectors', () => ({
  ...jest.requireActual('@shopgate/pwa-common-commerce/category/selectors'),
  hasCategoryChildren: jest.fn().mockReturnValue(false),
}));
jest.mock('@shopgate/engage/a11y', () => ({
  Section: ({ children, title }) => <section aria-label={title}>{children}</section>,
}));

jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/category/components', () => ({
  CategoryList: jest.fn(() => null),
}));

describe('<CategoryListContent />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    const { container } = render((
      <Provider store={store}>
        <CategoryListContent categoryId="1234" />
      </Provider>
    ));

    expect(container).toBeEmptyDOMElement();
    expect(CategoryList).not.toHaveBeenCalled();
  });

  it('should render with CategoryList', () => {
    hasCategoryChildren.mockReturnValueOnce(true);
    render((
      <Provider store={store}>
        <CategoryListContent categoryId="1234" />
      </Provider>
    ));

    expect(screen.getByRole('region', { name: 'category.sections.categories' })).toBeInTheDocument();
    expect(CategoryList.mock.lastCall[0]).toEqual(expect.objectContaining({
      categories: null,
      parentCategory: null,
      prerender: 0,
    }));
  });
});
/* eslint-enable react/prop-types */
