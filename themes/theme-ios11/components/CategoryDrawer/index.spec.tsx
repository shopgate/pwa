import {
  render, screen, fireEvent, act, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { bin2hex } from '@shopgate/engage/core/helpers';
import { UIEvents } from '@shopgate/engage/core/events';
import { OPEN_CATEGORY_DRAWER } from '@shopgate/engage/navigation/constants';
import CategoryDrawer from './index';

const OPEN_EVENT = OPEN_CATEGORY_DRAWER;
const mockPush = jest.fn();
const LIST_SETTINGS = {
  showImages: false,
  showAllProducts: false,
  layout: 'list',
  grid: { columns: { small: 2 } },
};
let mockSettings = { ...LIST_SETTINGS };
let mockNewServices = false;
const mockSetStatusBarHidden = jest.fn();
const mockFetchCategory = jest.fn<Promise<unknown>, [string]>(() => Promise.reject(new Error('ENOTFOUND')));

jest.mock('@shopgate/engage/core/helpers', () => ({
  ...jest.requireActual('@shopgate/pwa-common/helpers/data'),
  i18n: { text: (key: string) => key },
  hasNewServices: () => mockNewServices,
  setStatusBarHidden: (hidden: boolean) => mockSetStatusBarHidden(hidden),
}));
jest.mock('@shopgate/engage/core/hooks', () => ({
  useNavigation: () => ({ push: mockPush }),
  useAppDispatch: () => jest.requireActual('react-redux').useDispatch(),
}));
jest.mock('@shopgate/engage/a11y/hooks', () => ({
  useTrackModalState: jest.fn(),
}));
jest.mock('@shopgate/engage/core/classes', () => ({
  PipelineRequest: class {
    input: { categoryId: string } = { categoryId: '' };

    setInput(input: { categoryId: string }) {
      this.input = input;
      return this;
    }

    setHandleErrors() {
      return this;
    }

    dispatch() {
      return mockFetchCategory(this.input.categoryId);
    }
  },
}));
jest.mock('@shopgate/engage/a11y', () => ({
  VisuallyHidden: ({ children }: { children: unknown }) => <span>{children}</span>,
}));
jest.mock('@shopgate/engage/components', () => ({
  SurroundPortals: ({ children }: { children: unknown }) => children,
  Portal: ({ children }: { children: unknown }) => children,
  ArrowIcon: () => null,
  ChevronIcon: () => null,
  CrossIcon: () => null,
  Ellipsis: ({ children }: { children: unknown }) => children,
}));
jest.mock('@shopgate/engage/product/hooks', () => ({
  useProductImageShadow: () => false,
}));
jest.mock('@shopgate/engage/components/v2', () => ({
  Button: ({ children, onClick }: { children: unknown; onClick: () => void }) => (
    <button type="button" onClick={onClick}>{children}</button>
  ),
}));
jest.mock('@shopgate/engage/category/components/CategoryImage', () => ({
  __esModule: true,
  default: ({ src }: { src: string }) => <img alt="" src={src} />,
}));
jest.mock('@shopgate/engage/category/hooks', () => ({
  useCategorySettings: () => mockSettings,
  useCategoryImageRatio: () => ({
    ratio: [1, 1],
    resolutions: [{
      width: 324,
      height: 324,
    }],
    aspectRatio: '1 / 1',
    thumbnailWidth: 36,
  }),
}));
jest.mock('@shopgate/engage/category/actions', () => ({
  receiveCategories: (categories: unknown[]) => ({
    type: 'TEST_RECEIVE_CATEGORIES',
    categories,
  }),
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
  outdoor: {
    id: 'outdoor',
    name: 'Outdoor',
    childrenCount: 0,
    parentCategoriesInfo: [
      {
        code: 'men',
        name: 'Men',
      },
      {
        code: 'coats',
        name: 'Coats',
      },
    ],
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

let mockChildren: Record<string, { children: string[] }> = {};
let modalCount = 0;

Element.prototype.scrollIntoView = jest.fn();

const renderDrawer = (route: Record<string, unknown> = {
  id: 'home',
  pattern: '/',
  pathname: '/',
}) => {
  const state = {
    a11y: { modalCount },
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
        ...mockChildren,
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

const isAppHidden = () => {
  const root = document.getElementById('root');
  return !!root && (root.hasAttribute('inert') || root.getAttribute('aria-hidden') === 'true');
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
  await waitFor(() => expect(document.querySelector('[data-test-id="CategoryDrawerLevel"]')).not.toBeNull());
};

describe('<CategoryDrawer />', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockFetchCategory.mockClear();
    mockFetchCategory.mockImplementation(() => Promise.resolve());
    mockNewServices = false;
    mockChildren = {};
    modalCount = 0;
    mockSetStatusBarHidden.mockClear();
    mockSettings = {
      ...LIST_SETTINGS,
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
    expect(screen.getByRole('button', { name: /^Men/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Kids' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'common.back' })).not.toBeInTheDocument();
    expect(isAppHidden()).toBe(true);
  });

  it('moves down into a category with children and back', async () => {
    renderDrawer();
    await open();

    await settle(() => fireEvent.click(screen.getByRole('button', { name: /^Men/ })));

    await waitFor(() => expect(screen.getByRole('heading')).toHaveTextContent('Men'));
    expect(screen.queryByRole('button', { name: 'category.showAllProducts.label' }))
      .not.toBeInTheDocument();
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
    expect(isAppHidden()).toBe(false);
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
    expect(screen.getByRole('button', { name: 'Jackets' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Shirts' })).not.toHaveAttribute('aria-current');
  });

  it('starts at the category named by the event', async () => {
    renderDrawer();
    await open({ categoryId: 'men' });

    expect(screen.getByRole('heading')).toHaveTextContent('Men');
    expect(screen.getByRole('button', { name: 'Jackets' })).toBeInTheDocument();
  });

  it('offers all products of a category when the setting is on', async () => {
    mockSettings = {
      ...LIST_SETTINGS,
      showImages: true,
      showAllProducts: true,
    };
    renderDrawer();
    await open({ categoryId: 'men' });

    await settle(() => fireEvent.click(screen.getByRole('button', { name: 'category.showAllProducts.label' })));

    expect(mockPush).toHaveBeenCalledWith(expect.objectContaining({
      pathname: '/category/men/all',
    }));
  });

  it('shows category images when the setting is on', async () => {
    mockSettings = {
      ...LIST_SETTINGS,
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

  it('moves the focus to the title when it opens and when the level changes', async () => {
    renderDrawer();
    await open();

    expect(screen.getByRole('heading')).toHaveFocus();

    await settle(() => fireEvent.click(screen.getByRole('button', { name: /^Men/ })));

    expect(screen.getByRole('heading')).toHaveTextContent('Men');
    expect(screen.getByRole('heading')).toHaveFocus();
  });

  it('ignores a start position that arrives after it was closed', async () => {
    let finish: (() => void) | null = null;
    mockFetchCategory.mockImplementation(() => new Promise<void>((resolve) => {
      finish = resolve;
    }));
    renderDrawer();

    await settle(() => UIEvents.emit(OPEN_EVENT, { categoryId: 'unknown' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await settle(() => fireEvent.keyDown(document, { key: 'Escape' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    mockFetchCategory.mockImplementation(() => Promise.resolve());
    await open();
    await settle(() => finish?.());

    expect(screen.getByRole('heading')).toHaveTextContent('navigation.categories');
    expect(screen.getByRole('button', { name: /^Men/ })).not.toHaveAttribute('aria-current');
  });

  it('leaves out all products with the new services, like the category page', async () => {
    mockNewServices = true;
    mockSettings = {
      ...LIST_SETTINGS,
      showImages: false,
      showAllProducts: true,
    };
    renderDrawer();
    await open({ categoryId: 'men' });

    expect(screen.getByRole('heading')).toHaveTextContent('Men');
    expect(screen.queryByRole('button', { name: 'category.showAllProducts.label' }))
      .not.toBeInTheDocument();
  });

  it('loads a level category that is unknown before it offers all of its products', async () => {
    mockSettings = {
      ...LIST_SETTINGS,
      showImages: false,
      showAllProducts: true,
    };
    renderDrawer({
      id: 'category',
      pattern: '/category/:categoryId',
      pathname: `/category/${bin2hex('outdoor')}`,
      params: { categoryId: bin2hex('outdoor') },
    });
    await open();

    expect(screen.getByRole('heading')).toHaveTextContent('Coats');
    expect(mockFetchCategory).toHaveBeenCalledWith('coats');
    expect(screen.queryByRole('button', { name: 'category.showAllProducts.label' }))
      .not.toBeInTheDocument();
  });

  it('stays open on escape while a dialog covers it', async () => {
    modalCount = 2;
    renderDrawer();
    await open();

    await settle(() => fireEvent.keyDown(document, { key: 'Escape' }));

    expect(screen.getByRole('dialog', { name: 'navigation.categories' })).toBeInTheDocument();
  });

  it('shows the categories as image tiles in the grid layout', async () => {
    mockSettings = {
      ...LIST_SETTINGS,
      layout: 'grid',
      grid: { columns: { small: 3 } },
    };
    const { baseElement } = renderDrawer();
    await open();

    const grid = baseElement.querySelector('.theme__category-drawer__grid') as HTMLElement;
    expect(grid).toBeInTheDocument();
    expect(grid.style.getPropertyValue('--category-drawer-columns')).toBe('3');
    expect(baseElement.querySelectorAll('.theme__category-drawer__tile')).toHaveLength(2);
    expect(baseElement.querySelector('img[src="https://example.com/kids.png"]')).toBeInTheDocument();

    await settle(() => fireEvent.click(screen.getByRole('button', { name: /^Men/ })));

    expect(screen.getByRole('heading')).toHaveTextContent('Men');
    expect(baseElement.querySelectorAll('.theme__category-drawer__tile')).toHaveLength(2);
  });

  it('hides the status bar while it is open', async () => {
    renderDrawer();
    await open();

    expect(mockSetStatusBarHidden).toHaveBeenLastCalledWith(true);

    await settle(() => fireEvent.click(screen.getByRole('button', { name: 'common.close' })));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    expect(mockSetStatusBarHidden).toHaveBeenLastCalledWith(false);
  });

  it('opens a category whose subcategories turn out to be empty', async () => {
    mockChildren = { men: { children: [] } };
    renderDrawer();
    await open();

    await settle(() => fireEvent.click(screen.getByRole('button', { name: /^Men/ })));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/category/men',
      state: {
        categoryId: 'men',
        title: 'Men',
      },
    });
  });
});
