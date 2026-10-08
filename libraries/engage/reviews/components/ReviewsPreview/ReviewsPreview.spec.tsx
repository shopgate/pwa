import { Children, isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { render, screen, fireEvent } from '@testing-library/react';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { PRODUCT_REVIEWS } from '@shopgate/engage/product/constants';
import { REVIEW_PREVIEW_COUNT } from '@shopgate/pwa-common-commerce/reviews/constants';
import type { Review } from '@shopgate/pwa-common-commerce/reviews/types/reviews';
import type { ReviewSummary } from '@shopgate/pwa-common-commerce/reviews/types/reviewSummary';
import ReviewsPreview from './ReviewsPreview';
import type { ReviewsPreviewProps } from './ReviewsPreview';

type MockPreviewState = {
  baseProductId: string;
  active: boolean;
  summary: ReviewSummary | null;
  expectsSummary: boolean;
  hasRateFilter: boolean;
  reviews: Review[] | null;
  missing: boolean;
  loading: boolean;
  error: boolean;
};

let mockPreview: MockPreviewState;

jest.mock('@shopgate/pwa-common/components/SurroundPortals', () => ({
  __esModule: true,
  default: jest.fn(({ children }: { children: ReactNode }) => children),
}));
jest.mock('@shopgate/engage/product/selectors/product', () => ({
  ...jest.requireActual('@shopgate/engage/product/selectors/product'),
  getBaseProductId: () => mockPreview.baseProductId,
  makeIsBaseProductActive: () => () => mockPreview.active,
}));
jest.mock('@shopgate/pwa-common-commerce/reviews/selectors', () => {
  /**
   * Returns the mocked value only for the base product, so that a wrong product id fails the tests.
   * @param getValue Supplies the mocked value.
   * @param fallback The value for any other product id.
   * @returns The mocked selector.
   */
  const mockBaseSelector = <T, >(getValue: () => T, fallback: T) => (
    _state: unknown,
    props: { productId?: string }
  ) => (props.productId === mockPreview.baseProductId ? getValue() : fallback);

  return {
    ...jest.requireActual('@shopgate/pwa-common-commerce/reviews/selectors'),
    hasReviewFeature: (_state: unknown, feature: string) => (
      feature === 'ratingSummary' && mockPreview.expectsSummary
    ),
    getReviewFilterOptions: () => (mockPreview.hasRateFilter ? [{
      param: 'filterRate',
      type: 'rate',
      label: 'reviews.filter_rate_all',
    }] : []),
    getReviewSummary: mockBaseSelector(() => mockPreview.summary, null),
    getProductReviewsExcerpt: mockBaseSelector(() => mockPreview.reviews, null),
    isProductReviewsExcerptMissing: mockBaseSelector(() => mockPreview.missing, false),
    isProductReviewsExcerptLoading: mockBaseSelector(() => mockPreview.loading, false),
    hasProductReviewsExcerptError: mockBaseSelector(() => mockPreview.error, false),
  };
});
jest.mock('@shopgate/pwa-common/actions/router', () => ({
  historyPush: (params: unknown) => ({
    type: 'HISTORY_PUSH',
    params,
  }),
}));
jest.mock('@shopgate/pwa-common-commerce/reviews/actions/fetchProductReviews', () => ({
  __esModule: true,
  default: (productId: string, limit: number) => ({
    type: 'FETCH_PRODUCT_REVIEWS',
    productId,
    limit,
  }),
}));
jest.mock('../Reviews/components/Header/components/WriteReviewLink', () => ({
  __esModule: true,
  default: ({ productId, fullWidth }: { productId: string; fullWidth?: boolean }) => (
    <div data-testid="write-review-link" data-product-id={productId} data-full-width={fullWidth} />
  ),
}));
jest.mock('../Reviews/components/AllReviewsLink', () => ({
  __esModule: true,
  default: ({ productId, fullWidth }: { productId: string; fullWidth?: boolean }) => (
    <div data-testid="all-reviews-link" data-product-id={productId} data-full-width={fullWidth} />
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
const hasReviewsGetter = jest.fn();
const showWriteReviewGetter = jest.fn();

Object.defineProperty(config, 'hasReviews', {
  get: hasReviewsGetter,
  configurable: true,
});
Object.defineProperty(config, 'showWriteReview', {
  get: showWriteReviewGetter,
  configurable: true,
});

/**
 * Renders the preview with a store that records dispatched actions.
 * @returns The render result and the dispatched actions.
 */
const renderPreview = (props: Partial<ReviewsPreviewProps> = {}) => {
  const store = createStore(() => ({}));
  const dispatchSpy = jest.spyOn(store, 'dispatch');
  const result = render(
    <Provider store={store}>
      <ReviewsPreview productId="variant" {...props} />
    </Provider>
  );

  return {
    ...result,
    getActions: () => dispatchSpy.mock.calls.map(([action]) => action),
  };
};

describe('<ReviewsPreview />', () => {
  beforeEach(() => {
    jest.mocked(SurroundPortals).mockClear();
    hasReviewsGetter.mockReturnValue(true);
    showWriteReviewGetter.mockReturnValue(true);
    mockPreview = {
      baseProductId: 'base',
      active: true,
      summary: {
        average: 78,
        count: 12,
      },
      expectsSummary: false,
      hasRateFilter: false,
      reviews,
      missing: false,
      loading: false,
      error: false,
    };
  });

  it('should render the review section with summary, reviews and links', () => {
    const { container } = renderPreview();

    const section = container.querySelector('[data-test-id="reviewSection"]');
    expect(section).toHaveClass('engage__reviews__reviews');
    expect(section).toHaveClass('engage__reviews__reviews-preview');

    const excerpt = container.querySelector('#reviewsExcerpt');
    expect(excerpt).toHaveClass('engage__reviews__reviews-excerpt');
    expect(excerpt?.querySelector('.engage__reviews__reviews-summary')).toBeInTheDocument();

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByTestId('all-reviews-link')).toHaveAttribute('data-product-id', 'base');
    expect(screen.getByTestId('all-reviews-link')).toHaveAttribute('data-full-width', 'true');

    const actions = container.querySelector('.engage__reviews__reviews-preview__actions');
    expect(actions).toContainElement(screen.getByTestId('all-reviews-link'));
    expect(actions).toContainElement(screen.getByTestId('write-review-link'));
    expect(screen.getByTestId('write-review-link')).toHaveAttribute('data-product-id', 'base');
    expect(screen.getByTestId('write-review-link')).toHaveAttribute('data-full-width', 'true');
    expect(screen.getByTestId('reviews-info')).toBeInTheDocument();
  });

  it('should render nothing inside the portal when reviews are disabled', () => {
    hasReviewsGetter.mockReturnValue(false);

    const { container } = renderPreview();

    expect(container.querySelector('[data-test-id="reviewSection"]')).not.toBeInTheDocument();
    expect(jest.mocked(SurroundPortals).mock.calls.map(([props]) => props.portalName))
      .toContain(PRODUCT_REVIEWS);
  });

  it('should render nothing when the base product is not active', () => {
    mockPreview.active = false;

    const { container } = renderPreview();

    expect(container.querySelector('[data-test-id="reviewSection"]')).not.toBeInTheDocument();
  });

  it('should hide the write review link when writing reviews is disabled', () => {
    showWriteReviewGetter.mockReturnValue(false);

    renderPreview();

    expect(screen.queryByTestId('write-review-link')).not.toBeInTheDocument();
  });

  it('should show the empty list and the write link without ratings', () => {
    mockPreview.summary = null;
    mockPreview.reviews = [];

    const { container } = renderPreview();

    expect(container.querySelector('#reviewsExcerpt')).toBeInTheDocument();
    expect(container.querySelector('.engage__reviews__reviews-summary')).not.toBeInTheDocument();
    expect(screen.getByTestId('write-review-link')).toBeInTheDocument();
    expect(screen.getByText('reviews.list_empty')).toBeInTheDocument();
  });

  it('should show the loading state while the preview is loading', () => {
    mockPreview.reviews = null;
    mockPreview.loading = true;

    renderPreview();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should show the summary placeholder while a provider summary is loading', () => {
    mockPreview.summary = null;
    mockPreview.reviews = null;
    mockPreview.loading = true;
    mockPreview.expectsSummary = true;

    const { container } = renderPreview();

    expect(container.querySelector('.engage__reviews__reviews-summary__placeholder'))
      .toBeInTheDocument();
  });

  it('should not show the summary placeholder without a provider summary', () => {
    mockPreview.summary = null;
    mockPreview.reviews = null;
    mockPreview.loading = true;

    const { container } = renderPreview();

    expect(container.querySelector('.engage__reviews__reviews-summary__placeholder'))
      .not.toBeInTheDocument();
  });

  describe('distribution rows', () => {
    beforeEach(() => {
      mockPreview.summary = {
        average: 69,
        count: 35,
        distribution: {
          5: 10,
          4: 9,
          3: 7,
          2: 5,
          1: 4,
        },
      };
    });

    it('should open the review page of the base product with the star filter of a row', () => {
      mockPreview.hasRateFilter = true;

      const { container, getActions } = renderPreview();
      const row = container.querySelector('[data-stars="4"] button') as HTMLElement;

      expect(row).toHaveAccessibleName('reviews.distribution_open');
      expect(row).not.toHaveAttribute('aria-pressed');

      fireEvent.click(row);

      expect(getActions()).toEqual([{
        type: 'HISTORY_PUSH',
        params: {
          pathname: `/item/${bin2hex('base')}/reviews`,
          state: { filterRate: 4 },
        },
      }]);
    });

    it('should not render row buttons when the provider has no star filter', () => {
      const { container } = renderPreview();

      expect(screen.queryByRole('button', { name: 'reviews.distribution_open' }))
        .not.toBeInTheDocument();
      expect(container.querySelectorAll('.engage__reviews__reviews-summary__distribution-row'))
        .toHaveLength(5);
    });
  });

  it('should show the error state and retry the preview request', () => {
    mockPreview.reviews = null;
    mockPreview.error = true;

    const { getActions } = renderPreview();

    expect(screen.getByRole('alert')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'reviews.button_retry' }));

    expect(getActions()).toEqual([{
      type: 'FETCH_PRODUCT_REVIEWS',
      productId: 'base',
      limit: REVIEW_PREVIEW_COUNT,
    }]);
  });

  it('should request the preview when it was not requested yet', () => {
    mockPreview.reviews = null;
    mockPreview.missing = true;
    mockPreview.loading = true;

    const { getActions } = renderPreview();

    expect(getActions()).toEqual([{
      type: 'FETCH_PRODUCT_REVIEWS',
      productId: 'base',
      limit: REVIEW_PREVIEW_COUNT,
    }]);
  });

  it('should request a missing preview only once across re-renders', () => {
    mockPreview.reviews = null;
    mockPreview.missing = true;
    mockPreview.loading = true;

    const { rerender, getActions } = renderPreview();
    rerender(
      <Provider store={createStore(() => ({}))}>
        <ReviewsPreview productId="variant" />
      </Provider>
    );

    expect(getActions()).toHaveLength(1);
  });

  it('should not request a missing preview when reviews are disabled', () => {
    hasReviewsGetter.mockReturnValue(false);
    mockPreview.missing = true;

    const { getActions } = renderPreview();

    expect(getActions()).toEqual([]);
  });

  it('should not request a missing preview when the base product is not active', () => {
    mockPreview.active = false;
    mockPreview.missing = true;

    const { getActions } = renderPreview();

    expect(getActions()).toEqual([]);
  });

  it('should not request the preview when it was requested already', () => {
    const { getActions } = renderPreview();

    expect(getActions()).toEqual([]);
  });

  it('should keep the portal contract and the child order of the review section', () => {
    renderPreview();

    const portalCall = jest.mocked(SurroundPortals).mock.calls
      .find(([props]) => props.portalName === PRODUCT_REVIEWS);
    expect(portalCall?.[0].portalProps).toEqual({ productId: 'variant' });

    const section = portalCall?.[0].children as ReactElement;
    const sectionChildren = Children.toArray(section.props.children);
    expect(sectionChildren).toHaveLength(4);

    const list = sectionChildren[1];
    expect(isValidElement(list) && (list.props as { reviews: Review[] }).reviews).toBe(reviews);
  });

  describe('without the portal', () => {
    /**
     * Collects the names of the portals rendered so far.
     * @returns The portal names.
     */
    const getPortalNames = () => jest.mocked(SurroundPortals).mock.calls
      .map(([props]) => props.portalName);

    it('should render the review section outside of the review portal', () => {
      const { container } = renderPreview({ disablePortal: true });

      const section = container.querySelector('[data-test-id="reviewSection"]');
      expect(section).toBeInTheDocument();
      expect(section?.querySelector('#reviewsExcerpt')).toBeInTheDocument();
      expect(screen.getByTestId('all-reviews-link')).toHaveAttribute('data-product-id', 'base');
      expect(screen.getByTestId('write-review-link')).toHaveAttribute('data-product-id', 'base');
      expect(getPortalNames()).not.toContain(PRODUCT_REVIEWS);
    });

    it('should render nothing when reviews are disabled', () => {
      hasReviewsGetter.mockReturnValue(false);

      const { container } = renderPreview({ disablePortal: true });

      expect(container).toBeEmptyDOMElement();
    });

    it('should render nothing when the base product is not active', () => {
      mockPreview.active = false;

      const { container } = renderPreview({ disablePortal: true });

      expect(container).toBeEmptyDOMElement();
    });

    it('should request the preview when it was not requested yet', () => {
      mockPreview.missing = true;

      const { getActions } = renderPreview({ disablePortal: true });

      expect(getActions()).toEqual([{
        type: 'FETCH_PRODUCT_REVIEWS',
        productId: 'base',
        limit: REVIEW_PREVIEW_COUNT,
      }]);
    });

    it('should mark the section when the gutters are disabled', () => {
      const { container } = renderPreview({
        disablePortal: true,
        disableGutters: true,
      });

      expect(container.querySelector('[data-test-id="reviewSection"]'))
        .toHaveAttribute('data-disable-gutters', 'true');
    });
  });

  it('should keep the gutters by default', () => {
    const { container } = renderPreview();

    expect(container.querySelector('[data-test-id="reviewSection"]'))
      .not.toHaveAttribute('data-disable-gutters');
  });
});
