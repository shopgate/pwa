import { Provider } from 'react-redux';
import { createStore } from 'redux';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import type { Review, ReviewVotes } from '@shopgate/pwa-common-commerce/reviews/types/reviews';
import ReviewVoting from './ReviewVoting';

let mockSubmitResult: Promise<unknown>;

jest.mock('@shopgate/pwa-common-commerce/reviews/actions/submitReviewRate', () => ({
  __esModule: true,
  default: jest.fn((reviewId: unknown, rate: unknown) => ({
    type: 'SUBMIT_REVIEW_RATE',
    reviewId,
    rate,
  })),
}));

const review: Review = {
  id: 12,
  rate: 80,
  reviewRate: {
    up: 3,
    down: 0,
  },
};

type RenderOptions = {
  features?: string[];
  reviewVotes?: ReviewVotes;
  review?: Review;
};

/**
 * Renders the voting with a store that records dispatched actions.
 * @param options The provider features, the stored votes and the review.
 * @returns The render result and the dispatched actions.
 */
const renderVoting = ({
  features = ['reviewRate'],
  reviewVotes = {},
  review: renderedReview = review,
}: RenderOptions = {}) => {
  const store = createStore(() => ({
    reviews: { reviewSettings: { features } },
    reviewVotes,
  }));
  const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation((() => mockSubmitResult) as never);
  const result = render(
    <Provider store={store}>
      <ReviewVoting review={renderedReview} />
    </Provider>
  );

  return {
    ...result,
    getActions: () => dispatchSpy.mock.calls.map(([action]) => action),
  };
};

describe('<ReviewVoting />', () => {
  beforeEach(() => {
    mockSubmitResult = Promise.resolve(null);
  });

  it('should render nothing when the provider does not support voting', () => {
    const { container } = renderVoting({ features: [] });

    expect(container).toBeEmptyDOMElement();
  });

  it('should display the vote counts including zero', () => {
    const { container } = renderVoting();

    expect(container.querySelector('.engage__reviews__review-voting__up')).toHaveTextContent('3');
    expect(container.querySelector('.engage__reviews__review-voting__down')).toHaveTextContent('0');
    expect(screen.getByRole('button', { name: 'reviews.vote_up: 3' }))
      .toHaveAttribute('aria-disabled', 'false');
    expect(screen.getByRole('button', { name: 'reviews.vote_up: 3' }))
      .toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'reviews.vote_down: 0' })).toBeInTheDocument();
  });

  it('should render the controls without numbers when the counts are missing', () => {
    const { container } = renderVoting({
      review: {
        id: 12,
        rate: 80,
      },
    });

    expect(container.querySelector('.engage__reviews__review-voting__up')).toHaveTextContent('');
    expect(screen.getByRole('button', { name: 'reviews.vote_up' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'reviews.vote_down' })).toBeInTheDocument();
  });

  it('should submit a vote and block the controls while it is pending', async () => {
    let resolveSubmit: (value: unknown) => void = () => undefined;
    mockSubmitResult = new Promise((resolve) => {
      resolveSubmit = resolve;
    });

    const { getActions } = renderVoting();
    const up = screen.getByRole('button', { name: 'reviews.vote_up: 3' });
    const down = screen.getByRole('button', { name: 'reviews.vote_down: 0' });

    fireEvent.click(down);
    fireEvent.click(up);

    expect(getActions()).toEqual([{
      type: 'SUBMIT_REVIEW_RATE',
      reviewId: 12,
      rate: 'down',
    }]);
    expect(up).toHaveAttribute('aria-disabled', 'true');
    expect(down).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('reviews.vote_pending');

    resolveSubmit(null);

    await waitFor(() => {
      expect(up).toHaveAttribute('aria-disabled', 'false');
    });
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('should enable the controls again after a failed vote', async () => {
    mockSubmitResult = Promise.reject(new Error('failed'));

    renderVoting();
    const up = screen.getByRole('button', { name: 'reviews.vote_up: 3' });

    fireEvent.click(up);

    await waitFor(() => {
      expect(up).toHaveAttribute('aria-disabled', 'false');
    });
    expect(up).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('status')).toHaveTextContent('reviews.vote_error');
  });

  it('should mark the own vote and block further votes', () => {
    const { getActions } = renderVoting({ reviewVotes: { 12: 'up' } });
    const up = screen.getByRole('button', { name: 'reviews.vote_up: 3' });
    const down = screen.getByRole('button', { name: 'reviews.vote_down: 0' });

    expect(up).toHaveAttribute('aria-pressed', 'true');
    expect(up).toHaveAttribute('aria-disabled', 'true');
    expect(down).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(down);

    expect(getActions()).toEqual([]);
  });
});
