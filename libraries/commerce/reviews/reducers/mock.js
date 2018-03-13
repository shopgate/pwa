import { testReviews } from '../selectors/mock';

const reviews = testReviews.slice();

let currentId = reviews.length;
// Copy of reviews with different ids.
const moreReviews = reviews.map((review) => {
  currentId += 1;

  return {
    ...review,
    id: currentId,
  };
});

export const mockedReviews = reviews;
export const moreMockedReviews = moreReviews;
export const totalReviewCount = reviews.length + moreReviews.length;
