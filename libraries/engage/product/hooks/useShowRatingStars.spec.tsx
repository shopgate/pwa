import { render } from '@testing-library/react';
import { useReviewVisibility } from '@shopgate/engage/reviews/hooks';
import useShowEmptyRatingStars from './useShowEmptyRatingStars';
import useShowRatingStars from './useShowRatingStars';
import type { RatingStarsRating } from './useShowRatingStars';

jest.mock('@shopgate/engage/reviews/hooks', () => ({ useReviewVisibility: jest.fn() }));
jest.mock('./useShowEmptyRatingStars', () => ({
  __esModule: true,
  default: jest.fn(),
}));

interface SetupOptions {
  showReviews?: boolean;
  showEmptyStars?: boolean;
}

const setup = ({ showReviews = true, showEmptyStars = false }: SetupOptions = {}) => {
  (useReviewVisibility as jest.Mock).mockReturnValue({
    showReviews,
    showWriteReview: true,
  });
  (useShowEmptyRatingStars as jest.Mock).mockReturnValue(showEmptyStars);
};

const renderHook = (rating?: RatingStarsRating): boolean | undefined => {
  let result: boolean | undefined;

  const Consumer = () => {
    result = useShowRatingStars(rating);
    return null;
  };

  render(<Consumer />);

  return result;
};

describe('useShowRatingStars', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the stars of a rated product', () => {
    setup();

    expect(renderHook({ average: 80 })).toBe(true);
  });

  it('hides the stars of a rated product while reviews are off', () => {
    setup({ showReviews: false });

    expect(renderHook({ average: 80 })).toBe(false);
  });

  it.each([0, null, undefined, -10])('shows empty stars for the average %p when they are on', (average) => {
    setup({ showEmptyStars: true });

    expect(renderHook({ average })).toBe(true);
  });

  it.each([0, null, undefined, -10])('hides empty stars for the average %p when they are off', (average) => {
    setup();

    expect(renderHook({ average })).toBe(false);
  });

  it('hides empty stars while reviews are off', () => {
    setup({
      showReviews: false,
      showEmptyStars: true,
    });

    expect(renderHook({ average: 0 })).toBe(false);
  });

  it.each([null, undefined])('hides the stars without a rating (%p)', (rating) => {
    setup({ showEmptyStars: true });

    expect(renderHook(rating)).toBe(false);
  });
});
