import { useReviewVisibility } from '@shopgate/engage/reviews/hooks';
import useShowEmptyRatingStars from './useShowEmptyRatingStars';

/** A rating with its average on a scale from 0 to 100. */
export type RatingStarsRating = { average?: number | null } | null;

/**
 * Resolves whether rating stars are shown for a rating. Always false while reviews are off.
 * @param rating The review summary or the product rating. Without one, no stars are shown.
 * @returns Whether the rating stars are shown.
 */
const useShowRatingStars = (rating?: RatingStarsRating): boolean => {
  const { showReviews } = useReviewVisibility();
  const showEmptyRatingStars = useShowEmptyRatingStars();

  if (!showReviews || !rating) {
    return false;
  }

  return (rating.average ?? 0) > 0 || showEmptyRatingStars;
};

export default useShowRatingStars;
