import { generateResultHash } from '@shopgate/pwa-common/helpers/redux';
import requestReviews from '../action-creators/requestReviews';
import receiveReviews from '../action-creators/receiveReviews';
import { RECEIVE_SUBMIT_REVIEW } from '../constants';
import { SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS } from '../constants/Pipelines';
import reviewsByHash from './reviewsByHash';

const hash = generateResultHash({
  pipeline: SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS,
  productId: 'foo',
}, false);

const meta = {
  requestId: 1,
  offset: 0,
  sort: 'rateDesc',
  filters: { filterMedia: true as const },
};

/**
 * @param productId The id of the reviewed product.
 * @returns The action dispatched when a review of the product was submitted.
 */
const receiveSubmitReview = (productId: string) => ({
  type: RECEIVE_SUBMIT_REVIEW as typeof RECEIVE_SUBMIT_REVIEW,
  review: { productId },
});

/**
 * @returns The state after the first page of the product's list was received.
 */
const receiveList = () => {
  const requested = reviewsByHash({}, requestReviews(hash, meta));

  return reviewsByHash(requested, receiveReviews(hash, 'foo', [{
    id: 1,
    rate: 80,
  }], 7, meta));
};

describe('Reviews reducers: reviewsByHash submit', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(1000);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should expire the list of the reviewed product and keep its query and reviews', () => {
    const received = receiveList();

    jest.setSystemTime(2000);
    const next = reviewsByHash(received, receiveSubmitReview('foo'));

    expect(next[hash]).toEqual({
      ...received[hash],
      expires: 2000,
    });
  });

  it('should leave the lists of other products unchanged', () => {
    const received = receiveList();

    expect(reviewsByHash(received, receiveSubmitReview('bar'))).toBe(received);
  });
});
