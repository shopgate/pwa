import { useSelector } from 'react-redux';
import {
  getShowReviews,
  getShowWriteReview,
} from '@shopgate/engage/settings/selectors/appSettings';

export interface ReviewVisibility {
  /** Whether ratings, reviews and the entry points to the review pages are shown. */
  showReviews: boolean;
  /** Whether the app offers to write a review. */
  showWriteReview: boolean;
}

/**
 * Reads the merchant settings that switch ratings, reviews and the write review entry points.
 * @returns The review visibility settings.
 */
const useReviewVisibility = (): ReviewVisibility => ({
  showReviews: useSelector(getShowReviews),
  showWriteReview: useSelector(getShowWriteReview),
});

export default useReviewVisibility;
