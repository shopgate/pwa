import { Children, isValidElement } from 'react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { render, screen, fireEvent } from '@testing-library/react';
import appConfig from '@shopgate/pwa-common/helpers/config';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { REVIEW_ITEMS_PER_PAGE } from '@shopgate/pwa-common-commerce/reviews/constants';
import { PRODUCT_REVIEWS_ALL } from '@shopgate/pwa-common-commerce/reviews/constants/Portals';
import type {
  Review,
  ReviewFilterOption,
  ReviewListFilters,
} from '@shopgate/pwa-common-commerce/reviews/types/reviews';
import type { ReviewSummary } from '@shopgate/pwa-common-commerce/reviews/types/reviewSummary';
import ReviewsPage from './ReviewsPage';

type MockPageState = {
  baseProductId: string | null;
  productFetching: boolean;
  summary: ReviewSummary | null;
  expectsSummary: boolean;
  reviews: Review[];
  totalCount: number | null;
  hasMore: boolean;
  sort: string;
  filters: ReviewListFilters;
  queryChanged: boolean;
  sortOptions: string[];
  filterOptions: ReviewFilterOption[];
  requestOffset: number;
  missing: boolean;
  loading: boolean;
  fetching: boolean;
  error: boolean;
};

type SelectorProps = {
  productId?: string;
  variantId?: string | null;
};

let mockPage: MockPageState;

jest.mock('@shopgate/pwa-common/components/SurroundPortals', () => ({
  __esModule: true,
  default: jest.fn(({ children }: { children: ReactNode }) => children),
}));
jest.mock('@shopgate/engage/product/selectors/product', () => ({
  ...jest.requireActual('@shopgate/engage/product/selectors/product'),
  getBaseProductId: () => mockPage.baseProductId,
  getProductIsFetching: (_state: unknown, props: SelectorProps) => (
    props.productId === 'route' && mockPage.productFetching
  ),
}));
jest.mock('@shopgate/pwa-common-commerce/reviews/selectors', () => {
  /**
   * Returns the mocked value only for the route product without a variant, so that wrong
   * selector props fail the tests.
   * @param getValue Supplies the mocked value.
   * @param fallback The value for any other props.
   * @returns The mocked selector.
   */
  const mockListSelector = <T, >(getValue: () => T, fallback: T) => (
    _state: unknown,
    props: SelectorProps
  ) => (props.productId === 'route' && props.variantId === null ? getValue() : fallback);

  return {
    ...jest.requireActual('@shopgate/pwa-common-commerce/reviews/selectors'),
    hasReviewFeature: (_state: unknown, feature: string) => (
      feature === 'ratingSummary' && mockPage.expectsSummary
    ),
    getReviewSummary: (_state: unknown, props: SelectorProps) => (
      props.productId === (mockPage.baseProductId || 'route') ? mockPage.summary : null
    ),
    getProductReviews: mockListSelector<Review[]>(() => mockPage.reviews, []),
    getReviewsTotalCount: mockListSelector<number | null>(() => mockPage.totalCount, null),
    hasMoreReviews: mockListSelector(() => mockPage.hasMore, false),
    getReviewListSort: mockListSelector(() => mockPage.sort, 'dateDesc'),
    getReviewListFilters: mockListSelector<ReviewListFilters>(() => mockPage.filters, {}),
    isReviewListQueryChanged: mockListSelector(() => mockPage.queryChanged, false),
    getReviewSortOptions: () => mockPage.sortOptions,
    getReviewFilterOptions: () => mockPage.filterOptions,
    getReviewListRequestOffset: mockListSelector(() => mockPage.requestOffset, 0),
    getReviewsFetchingState: mockListSelector(() => mockPage.fetching, false),
    isReviewListMissing: mockListSelector(() => mockPage.missing, false),
    isReviewListLoading: mockListSelector(() => mockPage.loading, false),
    hasReviewListError: mockListSelector(() => mockPage.error, false),
  };
});
jest.mock('@shopgate/pwa-common-commerce/reviews/actions/fetchReviews', () => ({
  __esModule: true,
  default: (
    productId: string,
    limit: number,
    offset?: number,
    sort?: string,
    filters?: ReviewListFilters
  ) => ({
    type: 'FETCH_REVIEWS',
    productId,
    limit,
    offset,
    ...((sort && sort !== 'dateDesc') || (filters && Object.keys(filters).length > 0) ? {
      sort,
      filters,
    } : {}),
  }),
}));
jest.mock('../ReviewsToolbar', () => ({
  __esModule: true,
  default: ({
    sort,
    sortOptions,
    filters,
    filterOptions,
    onSortChange,
    onFilterChange,
  }: {
    sort: string;
    sortOptions: string[];
    filters: ReviewListFilters;
    filterOptions: ReviewFilterOption[];
    onSortChange: (sort: string) => void;
    onFilterChange: (param: keyof ReviewListFilters, value?: boolean | number) => void;
  }) => (sortOptions.length < 2 && filterOptions.length === 0 ? null : (
    <div
      className="engage__reviews__reviews-toolbar"
      data-sort={sort}
      data-filters={Object.keys(filters).join(',')}
    >
      <button type="button" onClick={() => onSortChange('rateDesc')}>sort by rating</button>
      <button type="button" onClick={() => onFilterChange('filterMedia', !filters.filterMedia)}>
        toggle media
      </button>
      <button
        type="button"
        onClick={() => onFilterChange('filterVerified', !filters.filterVerified)}
      >
        toggle verified
      </button>
      <button type="button" onClick={() => onFilterChange('filterRate', 5)}>five stars</button>
      <button type="button" onClick={() => onFilterChange('filterRate', undefined)}>
        all stars
      </button>
    </div>
  )),
}));
jest.mock('../Reviews/components/Header/components/WriteReviewLink', () => ({
  __esModule: true,
  default: ({ productId, fullWidth }: { productId: string; fullWidth?: boolean }) => (
    <div data-testid="write-review-link" data-product-id={productId} data-full-width={fullWidth} />
  ),
}));
jest.mock('../Reviews/components/ReviewsInfo', () => ({
  __esModule: true,
  default: () => <div data-testid="reviews-info" />,
}));

const reviews: Review[] = [
  {
    id: 1,
    rate: 80,
    title: 'Great tea',
    author: 'Max',
  },
  {
    id: 2,
    rate: 60,
    review: 'Nice',
  },
];

const config = appConfig as unknown as Record<string, unknown>;
const showWriteReviewGetter = jest.fn();

Object.defineProperty(config, 'showWriteReview', {
  get: showWriteReviewGetter,
  configurable: true,
});

/**
 * Renders the page with a store that records dispatched actions.
 * @returns The render result, a re-render with the same store and the dispatched actions.
 */
const renderPage = () => {
  const store = createStore(() => ({}));
  const dispatchSpy = jest.spyOn(store, 'dispatch');
  /**
   * @returns A new page element, so that a re-render evaluates the selectors again.
   */
  const createPage = () => (
    <Provider store={store}>
      <ReviewsPage productId="route" />
    </Provider>
  );
  const result = render(createPage());

  return {
    ...result,
    rerenderPage: () => result.rerender(createPage()),
    getActions: () => dispatchSpy.mock.calls.map(([action]) => action),
  };
};

describe('<ReviewsPage />', () => {
  beforeEach(() => {
    jest.mocked(SurroundPortals).mockClear();
    showWriteReviewGetter.mockReturnValue(true);
    mockPage = {
      baseProductId: 'base',
      productFetching: false,
      summary: {
        average: 78,
        count: 12,
      },
      expectsSummary: false,
      reviews,
      totalCount: 2,
      hasMore: false,
      sort: 'dateDesc',
      filters: {},
      queryChanged: false,
      sortOptions: [],
      filterOptions: [],
      requestOffset: 0,
      missing: false,
      loading: false,
      fetching: false,
      error: false,
    };
  });

  it('should render summary, list count, reviews, write link and review info', () => {
    const { container } = renderPage();

    const excerpt = container.querySelector('.engage__reviews__reviews-excerpt');
    expect(excerpt?.querySelector('.engage__reviews__reviews-summary')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('reviews.list_count')).toBeInTheDocument();
    expect(container.querySelector('.engage__reviews__reviews-page__actions'))
      .toContainElement(screen.getByTestId('write-review-link'));
    expect(screen.getByTestId('write-review-link')).toHaveAttribute('data-product-id', 'base');
    expect(screen.getByTestId('write-review-link')).toHaveAttribute('data-full-width', 'true');
    expect(screen.getByTestId('reviews-info')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'common.load_more' })).not.toBeInTheDocument();
  });

  it('should hide the write review link when writing reviews is disabled', () => {
    showWriteReviewGetter.mockReturnValue(false);

    renderPage();

    expect(screen.queryByTestId('write-review-link')).not.toBeInTheDocument();
  });

  it('should show the reviews when the summary is not available', () => {
    mockPage.summary = null;

    const { container } = renderPage();

    expect(container.querySelector('.engage__reviews__reviews-summary')).not.toBeInTheDocument();
    expect(screen.getByTestId('write-review-link')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('should use the route product id while the product is not available', () => {
    mockPage.baseProductId = null;

    const { container } = renderPage();

    expect(container.querySelector('.engage__reviews__reviews-summary')).toBeInTheDocument();
    expect(screen.getByTestId('write-review-link')).toHaveAttribute('data-product-id', 'route');
  });

  it('should show the loading state before the first response', () => {
    mockPage.reviews = [];
    mockPage.totalCount = null;
    mockPage.loading = true;

    renderPage();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByText('reviews.list_empty')).not.toBeInTheDocument();
  });

  it('should show the summary placeholder while a provider summary is loading', () => {
    mockPage.summary = null;
    mockPage.reviews = [];
    mockPage.totalCount = null;
    mockPage.loading = true;
    mockPage.expectsSummary = true;

    const { container } = renderPage();

    expect(container.querySelector('.engage__reviews__reviews-summary__placeholder'))
      .toBeInTheDocument();
  });

  it('should not show the summary placeholder without a provider summary', () => {
    mockPage.summary = null;
    mockPage.reviews = [];
    mockPage.totalCount = null;
    mockPage.loading = true;

    const { container } = renderPage();

    expect(container.querySelector('.engage__reviews__reviews-summary__placeholder'))
      .not.toBeInTheDocument();
  });

  it('should show the empty state without reviews', () => {
    mockPage.reviews = [];
    mockPage.totalCount = 0;

    renderPage();

    expect(screen.getByText('reviews.list_empty')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'common.load_more' })).not.toBeInTheDocument();
  });

  it('should load the next page with the number of loaded reviews as offset', () => {
    mockPage.totalCount = 12;
    mockPage.hasMore = true;

    const { getActions } = renderPage();

    fireEvent.click(screen.getByRole('button', { name: 'common.load_more' }));

    expect(getActions()).toEqual([{
      type: 'FETCH_REVIEWS',
      productId: 'base',
      limit: REVIEW_ITEMS_PER_PAGE,
      offset: 2,
    }]);
  });

  it('should offer load more without a total count when a further page exists', () => {
    mockPage.totalCount = null;
    mockPage.hasMore = true;

    renderPage();

    expect(screen.getByRole('button', { name: 'common.load_more' })).toBeInTheDocument();
  });

  it('should not offer load more without a further page', () => {
    mockPage.totalCount = 12;
    mockPage.hasMore = false;

    renderPage();

    expect(screen.queryByRole('button', { name: 'common.load_more' })).not.toBeInTheDocument();
  });

  it('should retry a failed first request', () => {
    mockPage.reviews = [];
    mockPage.totalCount = null;
    mockPage.error = true;

    const { getActions } = renderPage();

    expect(screen.getByRole('alert')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'reviews.button_retry' }));

    expect(getActions()).toEqual([{
      type: 'FETCH_REVIEWS',
      productId: 'base',
      limit: REVIEW_ITEMS_PER_PAGE,
      offset: 0,
    }]);
  });

  it('should keep the reviews and retry the failed request with its offset', () => {
    mockPage.totalCount = 12;
    mockPage.hasMore = true;
    mockPage.requestOffset = 2;
    mockPage.error = true;

    const { getActions } = renderPage();

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.queryByRole('button', { name: 'common.load_more' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'reviews.button_retry' }));

    expect(getActions()).toEqual([{
      type: 'FETCH_REVIEWS',
      productId: 'base',
      limit: REVIEW_ITEMS_PER_PAGE,
      offset: 2,
    }]);
  });

  it('should retry a failed refresh from the first page', () => {
    mockPage.totalCount = 12;
    mockPage.hasMore = true;
    mockPage.requestOffset = 0;
    mockPage.error = true;

    const { getActions } = renderPage();

    fireEvent.click(screen.getByRole('button', { name: 'reviews.button_retry' }));

    expect(getActions()).toEqual([expect.objectContaining({ offset: 0 })]);
  });

  it('should request the list when it was not requested for the base product yet', () => {
    mockPage.reviews = [];
    mockPage.totalCount = null;
    mockPage.missing = true;
    mockPage.loading = true;

    const { getActions } = renderPage();

    expect(getActions()).toEqual([{
      type: 'FETCH_REVIEWS',
      productId: 'base',
      limit: REVIEW_ITEMS_PER_PAGE,
      offset: undefined,
    }]);
  });

  it('should request a missing list for the base product after the product request', () => {
    mockPage.baseProductId = null;
    mockPage.productFetching = true;
    mockPage.reviews = [];
    mockPage.totalCount = null;
    mockPage.missing = true;
    mockPage.loading = true;

    const { rerenderPage, getActions } = renderPage();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(getActions()).toEqual([]);

    mockPage.baseProductId = 'base';
    mockPage.productFetching = false;
    rerenderPage();

    expect(getActions()).toEqual([{
      type: 'FETCH_REVIEWS',
      productId: 'base',
      limit: REVIEW_ITEMS_PER_PAGE,
      offset: undefined,
    }]);
  });

  it('should request a missing list for the route product when the product request failed', () => {
    mockPage.baseProductId = null;
    mockPage.reviews = [];
    mockPage.totalCount = null;
    mockPage.missing = true;
    mockPage.loading = true;

    const { getActions } = renderPage();

    expect(getActions()).toEqual([{
      type: 'FETCH_REVIEWS',
      productId: 'route',
      limit: REVIEW_ITEMS_PER_PAGE,
      offset: undefined,
    }]);
  });

  it('should not request the list when it was requested already', () => {
    const { getActions } = renderPage();

    expect(getActions()).toEqual([]);
  });

  it('should keep the portal contract with the list as second direct child', () => {
    mockPage.totalCount = 12;
    mockPage.hasMore = true;

    renderPage();

    const portalCall = jest.mocked(SurroundPortals).mock.calls
      .find(([props]) => props.portalName === PRODUCT_REVIEWS_ALL);
    expect(portalCall?.[0].portalProps).toEqual({ productId: 'route' });

    const children = Children.toArray(portalCall?.[0].children);
    expect(children).toHaveLength(5);

    const list = children[1];
    expect(isValidElement(list) && (list.props as { reviews: Review[] }).reviews).toBe(reviews);
  });

  it('should keep the list as second direct child without summary and reviews', () => {
    mockPage.summary = null;
    mockPage.reviews = [];
    mockPage.totalCount = 0;

    renderPage();

    const portalCall = jest.mocked(SurroundPortals).mock.calls
      .find(([props]) => props.portalName === PRODUCT_REVIEWS_ALL);
    const list = Children.toArray(portalCall?.[0].children)[1];

    expect(isValidElement(list) && (list.props as { reviews: Review[] }).reviews).toEqual([]);
  });

  describe('sorting and filtering', () => {
    beforeEach(() => {
      mockPage.sortOptions = ['dateDesc', 'rateDesc'];
      mockPage.filterOptions = [{
        param: 'filterMedia',
        type: 'toggle',
        label: 'reviews.filter_media',
      }];
      mockPage.totalCount = 12;
      mockPage.hasMore = true;
    });

    it('should not render the toolbar when the provider supports neither', () => {
      mockPage.sortOptions = [];
      mockPage.filterOptions = [];

      const { container } = renderPage();

      expect(container.querySelector('.engage__reviews__reviews-toolbar')).not.toBeInTheDocument();
    });

    it('should not render the toolbar before the list was requested', () => {
      mockPage.missing = true;
      mockPage.loading = true;
      mockPage.reviews = [];

      const { container } = renderPage();

      expect(container.querySelector('.engage__reviews__reviews-toolbar')).not.toBeInTheDocument();
    });

    it('should render the toolbar inside the excerpt block', () => {
      const { container } = renderPage();

      expect(container.querySelector('.engage__reviews__reviews-excerpt'))
        .toContainElement(container.querySelector('.engage__reviews__reviews-toolbar') as HTMLElement);
    });

    it('should request the first page with the selected sort and the current filter', () => {
      mockPage.filters = { filterMedia: true };

      const { getActions } = renderPage();

      fireEvent.click(screen.getByRole('button', { name: 'sort by rating' }));

      expect(getActions()).toEqual([{
        type: 'FETCH_REVIEWS',
        productId: 'base',
        limit: REVIEW_ITEMS_PER_PAGE,
        offset: 0,
        sort: 'rateDesc',
        filters: { filterMedia: true },
      }]);
    });

    it('should not request the list again when the current sort is selected', () => {
      mockPage.sort = 'rateDesc';

      const { getActions } = renderPage();

      fireEvent.click(screen.getByRole('button', { name: 'sort by rating' }));

      expect(getActions()).toEqual([]);
    });

    it('should request the first page with the toggled media filter and the current sort', () => {
      mockPage.sort = 'rateDesc';

      const { getActions } = renderPage();

      fireEvent.click(screen.getByRole('button', { name: 'toggle media' }));

      expect(getActions()).toEqual([{
        type: 'FETCH_REVIEWS',
        productId: 'base',
        limit: REVIEW_ITEMS_PER_PAGE,
        offset: 0,
        sort: 'rateDesc',
        filters: { filterMedia: true },
      }]);
    });

    it('should add a filter to the active ones', () => {
      mockPage.filters = { filterMedia: true };

      const { getActions } = renderPage();

      fireEvent.click(screen.getByRole('button', { name: 'toggle verified' }));

      expect(getActions()).toEqual([{
        type: 'FETCH_REVIEWS',
        productId: 'base',
        limit: REVIEW_ITEMS_PER_PAGE,
        offset: 0,
        sort: 'dateDesc',
        filters: {
          filterMedia: true,
          filterVerified: true,
        },
      }]);
    });

    it('should remove only the toggled filter', () => {
      mockPage.filters = {
        filterMedia: true,
        filterVerified: true,
      };

      const { getActions } = renderPage();

      fireEvent.click(screen.getByRole('button', { name: 'toggle media' }));

      expect(getActions()).toEqual([{
        type: 'FETCH_REVIEWS',
        productId: 'base',
        limit: REVIEW_ITEMS_PER_PAGE,
        offset: 0,
        sort: 'dateDesc',
        filters: { filterVerified: true },
      }]);
    });

    it('should set the star filter next to the active filters', () => {
      mockPage.filters = { filterMedia: true };

      const { getActions } = renderPage();

      fireEvent.click(screen.getByRole('button', { name: 'five stars' }));

      expect(getActions()).toEqual([{
        type: 'FETCH_REVIEWS',
        productId: 'base',
        limit: REVIEW_ITEMS_PER_PAGE,
        offset: 0,
        sort: 'dateDesc',
        filters: {
          filterMedia: true,
          filterRate: 5,
        },
      }]);
    });

    it('should remove the star filter and keep the other filters', () => {
      mockPage.filters = {
        filterMedia: true,
        filterRate: 5,
      };

      const { getActions } = renderPage();

      fireEvent.click(screen.getByRole('button', { name: 'all stars' }));

      expect(getActions()).toEqual([{
        type: 'FETCH_REVIEWS',
        productId: 'base',
        limit: REVIEW_ITEMS_PER_PAGE,
        offset: 0,
        sort: 'dateDesc',
        filters: { filterMedia: true },
      }]);
    });

    it('should not request the list again when a filter keeps its value', () => {
      mockPage.filters = { filterRate: 5 };

      const { getActions } = renderPage();

      fireEvent.click(screen.getByRole('button', { name: 'five stars' }));

      expect(getActions()).toEqual([]);
    });

    it('should load more and retry with the current sort and filter', () => {
      mockPage.sort = 'rateDesc';
      mockPage.filters = { filterMedia: true };

      const { getActions, rerenderPage } = renderPage();

      fireEvent.click(screen.getByRole('button', { name: 'common.load_more' }));

      expect(getActions()[0]).toEqual({
        type: 'FETCH_REVIEWS',
        productId: 'base',
        limit: REVIEW_ITEMS_PER_PAGE,
        offset: 2,
        sort: 'rateDesc',
        filters: { filterMedia: true },
      });

      mockPage.error = true;
      mockPage.requestOffset = 2;
      rerenderPage();
      fireEvent.click(screen.getByRole('button', { name: 'reviews.button_retry' }));

      expect(getActions()[1]).toEqual({
        type: 'FETCH_REVIEWS',
        productId: 'base',
        limit: REVIEW_ITEMS_PER_PAGE,
        offset: 2,
        sort: 'rateDesc',
        filters: { filterMedia: true },
      });
    });

    it('should hide the stored reviews and load more while another query is requested', () => {
      mockPage.queryChanged = true;
      mockPage.loading = true;

      renderPage();

      expect(screen.queryAllByRole('listitem')).toHaveLength(0);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.queryByText('reviews.list_count')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'common.load_more' })).not.toBeInTheDocument();
    });

    it('should show only the error when the request for another query failed', () => {
      mockPage.queryChanged = true;
      mockPage.error = true;
      mockPage.requestOffset = 0;
      mockPage.sort = 'rateDesc';

      const { getActions } = renderPage();

      expect(screen.queryAllByRole('listitem')).toHaveLength(0);
      fireEvent.click(screen.getByRole('button', { name: 'reviews.button_retry' }));

      expect(getActions()).toEqual([{
        type: 'FETCH_REVIEWS',
        productId: 'base',
        limit: REVIEW_ITEMS_PER_PAGE,
        offset: 0,
        sort: 'rateDesc',
        filters: {},
      }]);
    });

    it('should show the filtered empty text when the filter matches no review', () => {
      mockPage.filters = { filterMedia: true };
      mockPage.reviews = [];
      mockPage.totalCount = 0;
      mockPage.hasMore = false;

      const { container } = renderPage();

      expect(screen.getByText('reviews.list_empty_filtered')).toBeInTheDocument();
      expect(container.querySelector('.engage__reviews__reviews-toolbar'))
        .toHaveAttribute('data-filters', 'filterMedia');
    });
  });
});
