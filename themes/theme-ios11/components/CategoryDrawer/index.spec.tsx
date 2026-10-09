import {
  render, screen, fireEvent, act, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { bin2hex } from '@shopgate/engage/core/helpers';
import { UIEvents } from '@shopgate/engage/core/events';
import CategoryDrawer from './index';

const OPEN_EVENT = 'navigation.openCategoryDrawer';
const mockPush = jest.fn();
let mockSettings = {
  showImages: false,
  showAllProducts: false,
};

jest.mock('@shopgate/engage/core/helpers', () => ({
  ...jest.requireActual('@shopgate/pwa-common/helpers/data'),
  i18n: { text: (key: string) => key },
}));
jest.mock('@shopgate/engage/core/hooks', () => ({
  useNavigation: () => ({ push: mockPush }),
}));
jest.mock('@shopgate/engage/a11y/hooks', () => ({
  useTrackModalState: jest.fn(),
}));
jest.mock('@shopgate/engage/components', () => ({
  SurroundPortals: ({ children }: { children: unknown }) => children,
  ArrowIcon: () => null,
  ChevronIcon: () => null,
  CrossIcon: () => null,
}));
jest.mock('@shopgate/engage/components/v2', () => ({
  Button: ({ children, onClick }: { children: unknown; onClick: () => void }) => (
    <button type="button" onClick={onClick}>{children}</button>
  ),
}));
jest.mock('@shopgate/engage/category/components', () => ({
  CategoryImage: ({ src }: { src: string }) => <img alt="" src={src} />,
}));
jest.mock('@shopgate/engage/category/hooks', () => ({
  useCategorySettings: () => mockSettings,
}));
jest.mock('@shopgate/engage/category/actions', () => ({
  fetchCategory: () => () => Promise.resolve(),
  fetchCategoryChildren: () => () => Promise.resolve(),
  fetchRootCategories: () => () => Promise.resolve(),
}));
jest.mock('@shopgate/engage/category/helpers', () => ({
  getCategoryRoute: (id: string) => `/category/${id}`,
  getShowAllProductsFilters: () => ({}),
}));

const categoriesById = {
  men: {
    id: 'men',
    name: 'Men',
    childrenCount: 2,
    parentCategoriesInfo: [],
  },
  kids: {
    id: 'kids',
    name: 'Kids',
    childrenCount: 0,
    parentCategoriesInfo: [],
    imageUrl: 'https://example.com/kids.png',
  },
  jackets: {
    id: 'jackets',
    name: 'Jackets',
    childrenCount: 0,
    parentCategoriesInfo: [{
      code: 'men',
      name: 'Men',
    }],
  },
  shirts: {
    id: 'shirts',
    name: 'Shirts',
    childrenCount: 0,
    parentCategoriesInfo: [{
      code: 'men',
      name: 'Men',
    }],
  },
};

const renderDrawer = (route: Record<string, unknown> = {
  id: 'home',
  pattern: '/',
  pathname: '/',
}) => {
  const state = {
    router: {
      currentRoute: route,
      stack: [route],
    },
    category: {
      rootCategories: {
        categories: ['men', 'kids'],
        expires: 1,
      },
      categoriesById,
      childrenByCategoryId: {
        men: { children: ['jackets', 'shirts'] },
      },
    },
  };

  return render(
    <Provider store={createStore(() => state, applyMiddleware(thunk))}>
      <div id="root" />
      <CategoryDrawer />
    </Provider>
  );
};

const settle = async (action: () => void) => {
  await act(async () => {
    action();
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  });
};

const open = async (payload?: { categoryId?: string }) => {
  await settle(() => UIEvents.emit(OPEN_EVENT, payload));
  await screen.findByRole('list');
};

describe('<CategoryDrawer />', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockSettings = {
      showImages: false,
      showAllProducts: false,
    };
  });

  it('renders nothing until it is opened', () => {
    renderDrawer();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens at the root level and takes the app out of reach', async () => {
    renderDrawer();
    await open();

    expect(screen.getByRole('dialog', { name: 'navigation.categories' })).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveTextContent('navigation.categories');
    expect(screen.getByRole('button', { name: 'Men' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Kids' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'common.back' })).not.toBeInTheDocument();
    expect(document.getElementById('root')).toHaveAttribute('inert');
  });

  it('moves down into a category with children and back', async () => {
    renderDrawer();
    await open();

    await settle(() => fireEvent.click(screen.getByRole('button', { name: 'Men' })));

    await waitFor(() => expect(screen.getByRole('heading')).toHaveTextContent('Men'));
    expect(screen.getByRole('button', { name: 'category.drawer.show_all' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Jackets' })).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();

    await settle(() => fireEvent.click(screen.getByRole('button', { name: 'common.back' })));

    await waitFor(() => expect(screen.getByRole('heading')).toHaveTextContent('navigation.categories'));
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Jackets' })).not.toBeInTheDocument());
  });

  it('opens a category without children and closes', async () => {
    renderDrawer();
    await open();

    await settle(() => fireEvent.click(screen.getByRole('button', { name: 'Kids' })));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/category/kids',
      state: {
        categoryId: 'kids',
        title: 'Kids',
      },
    });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(document.getElementById('root')).not.toHaveAttribute('inert');
  });

  it('starts at the category of the current page and marks it', async () => {
    renderDrawer({
      id: 'category',
      pattern: '/category/:categoryId',
      pathname: `/category/${bin2hex('jackets')}`,
      params: { categoryId: bin2hex('jackets') },
    });
    await open();

    expect(screen.getByRole('heading')).toHaveTextContent('Men');
    expect(screen.getByRole('button', { name: 'Jackets' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('button', { name: 'Shirts' })).not.toHaveAttribute('aria-current');
  });

  it('starts at the category named by the event', async () => {
    renderDrawer();
    await open({ categoryId: 'men' });

    expect(screen.getByRole('heading')).toHaveTextContent('Men');
    expect(screen.getByRole('button', { name: 'category.drawer.show_all' }))
      .toHaveAttribute('aria-current', 'true');
  });

  it('offers all products of a category when the setting is on', async () => {
    mockSettings = {
      showImages: true,
      showAllProducts: true,
    };
    renderDrawer();
    await open({ categoryId: 'men' });

    await settle(() => fireEvent.click(screen.getByRole('button', { name: 'category.showAllProducts.label' })));

    expect(mockPush).toHaveBeenCalledWith(expect.objectContaining({
      pathname: `/category/${bin2hex('men')}/all`,
    }));
  });

  it('shows category images when the setting is on', async () => {
    mockSettings = {
      showImages: true,
      showAllProducts: false,
    };
    const { baseElement } = renderDrawer();
    await open();

    expect(baseElement.querySelector('img[src="https://example.com/kids.png"]')).toBeInTheDocument();
  });

  it('closes on escape and with the close button', async () => {
    renderDrawer();
    await open();

    await settle(() => fireEvent.keyDown(document, { key: 'Escape' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    await open();
    await settle(() => fireEvent.click(screen.getByRole('button', { name: 'common.close' })));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
