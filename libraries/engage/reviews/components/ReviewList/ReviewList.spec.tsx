import type { ReactNode } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { PRODUCT_REVIEWS_ENTRY } from '@shopgate/engage/product/constants';
import { i18n } from '@shopgate/engage/core/helpers/i18n';
import type { Review } from '@shopgate/pwa-common-commerce/reviews/types/reviews';
import ReviewList from './ReviewList';

jest.mock('@shopgate/pwa-common/components/SurroundPortals', () => ({
  __esModule: true,
  default: jest.fn(({ children }: { children: ReactNode }) => children),
}));

type I18nSpyTarget = Record<'text' | 'number' | 'date', (...args: unknown[]) => unknown>;

const i18nHelpers = i18n as unknown as I18nSpyTarget;

const reviews: Review[] = [
  {
    id: 1,
    rate: 80,
    title: 'Great tea',
    review: 'Tasty',
    author: 'Max',
  },
  {
    id: 2,
    rate: 40,
  },
];

/**
 * Reads the state of the list wrapper.
 * @param container The rendered container.
 * @returns The value of the data-state attribute of the list wrapper.
 */
const getState = (container: HTMLElement) => container
  .querySelector('.engage__reviews__review-list')
  ?.getAttribute('data-state');

describe('<ReviewList />', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.mocked(SurroundPortals).mockClear();
  });

  it('should render one entry per review in the given order', () => {
    const { container } = render(<ReviewList reviews={reviews} />);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveAttribute('data-test-id', 'reviewTitle: Great tea');
    expect(items[1]).toHaveAttribute('data-test-id', 'reviewTitle: undefined');
    expect(container.querySelector('ul.engage__reviews__list')).toBeInTheDocument();
    expect(container.querySelectorAll('.engage__reviews__review-card')).toHaveLength(2);
    expect(getState(container)).toBe('ready');
  });

  it('should wrap every review in the review entry portal', () => {
    render(<ReviewList reviews={reviews} />);

    expect(SurroundPortals).toHaveBeenCalledTimes(2);
    reviews.forEach((review, index) => {
      expect(jest.mocked(SurroundPortals).mock.calls[index][0]).toEqual(expect.objectContaining({
        portalName: PRODUCT_REVIEWS_ENTRY,
        portalProps: { review },
      }));
    });
  });

  it('should render the reviews as a list', () => {
    const { container } = render(<ReviewList reviews={reviews} />);

    expect(screen.getByRole('list')).toHaveClass('engage__reviews__list');
    expect(container.querySelector('.engage__reviews__review-list')).not.toHaveAttribute('aria-busy');
  });

  it('should label the list result count', () => {
    jest.spyOn(i18nHelpers, 'text').mockImplementation((key, params) => (
      `${key}:${(params as { count?: number })?.count}`
    ));

    const { container } = render(<ReviewList reviews={reviews} totalCount={7} />);

    expect(container.querySelector('.engage__reviews__review-list__count'))
      .toHaveTextContent(/^reviews\.list_count:7$/);
  });

  it('should not render the result count without a positive count', () => {
    const { container } = render(<ReviewList reviews={reviews} totalCount={0} />);

    expect(container.querySelector('.engage__reviews__review-list__count')).not.toBeInTheDocument();
  });

  it('should not render the result count without reviews', () => {
    const { container } = render(<ReviewList reviews={[]} totalCount={7} />);

    expect(container.querySelector('.engage__reviews__review-list__count')).not.toBeInTheDocument();
  });

  it('should show a progress indicator while loading without reviews', () => {
    const { container } = render(<ReviewList reviews={[]} isLoading />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(container.querySelector('.engage__reviews__review-list__loading')).toBeInTheDocument();
    expect(getState(container)).toBe('loading');
    expect(container.querySelector('.engage__reviews__review-list')).toHaveAttribute('aria-busy', 'true');
  });

  it('should keep the reviews visible while loading more', () => {
    const { container } = render(<ReviewList reviews={reviews} isLoading />);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(getState(container)).toBe('ready');
    expect(container.querySelector('.engage__reviews__review-list')).toHaveAttribute('aria-busy', 'true');
  });

  it('should show the empty state when there are no reviews', () => {
    const { container } = render(<ReviewList reviews={[]} />);

    expect(screen.getByText('reviews.list_empty')).toBeInTheDocument();
    expect(getState(container)).toBe('empty');
  });

  it('should show the error state and retry', () => {
    const onRetry = jest.fn();
    const { container } = render(<ReviewList reviews={[]} hasError onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('common.errors.generic');
    expect(getState(container)).toBe('error');

    fireEvent.click(screen.getByRole('button', { name: 'reviews.button_retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should show the error without a retry button when no retry handler is given', () => {
    render(<ReviewList reviews={[]} hasError />);

    expect(screen.getByRole('alert')).toHaveTextContent('common.errors.generic');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should show the error below already loaded reviews', () => {
    const { container } = render(<ReviewList reviews={reviews} hasError onRetry={jest.fn()} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(container.querySelector('.engage__reviews__review-list__error')).toBeInTheDocument();
  });

  it('should not show the error while a retry is loading', () => {
    const { container } = render(<ReviewList reviews={[]} hasError isLoading />);

    expect(container.querySelector('.engage__reviews__review-list__error')).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should explain the verified badge when a review is verified', () => {
    render(<ReviewList reviews={[{
      ...reviews[0],
      isVerified: true,
    }, reviews[1]]}
    />);

    expect(screen.getByText('reviews.verified_info')).toBeInTheDocument();
  });

  it('should not explain the verified badge without verified reviews', () => {
    render(<ReviewList reviews={[{
      ...reviews[0],
      isVerified: false,
    }, reviews[1]]}
    />);

    expect(screen.queryByText('reviews.verified_info')).not.toBeInTheDocument();
  });
});
