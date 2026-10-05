import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import I18nProvider from '@shopgate/pwa-common/components/I18n/components/I18nProvider';
import { getRootCategories } from '@shopgate/pwa-common-commerce/category/selectors';
import { CategoryList } from '@shopgate/engage/category/components';
import Headline from 'Components/Headline';
import RootCategories from './index';

const store = createMockStore();

jest.mock('@shopgate/pwa-common-commerce/category/selectors', () => ({
  getRootCategories: () => ([
    {
      id: '123-123',
      name: 'foo',
    },
    {
      id: '456-123',
      name: 'bar',
    },
    {
      id: '789-123',
      name: 'baz',
    },
    {
      id: '789-456',
      name: 'qux',
    },
  ]),
}));
jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/category/components', () => ({
  CategoryList: jest.fn(() => null),
}));
jest.mock('Components/Headline', () => jest.fn(() => null));

describe('<RootCategories />', () => {
  it('should render category list with root categories from store', () => {
    const expectedRootCategories = getRootCategories({});

    const { container } = render((
      <Provider store={store}>
        <I18nProvider>
          <RootCategories />
        </I18nProvider>
      </Provider>
    ));

    expect(container.querySelector('[data-test-id="categoriesList"]')).toBeInTheDocument();
    expect(Headline.mock.lastCall[0]).toEqual(expect.objectContaining({ text: 'titles.allCategories' }));
    expect(CategoryList.mock.lastCall[0]).toEqual({ categories: expectedRootCategories });
  });
});
