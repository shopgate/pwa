import requestReviews from '../action-creators/requestReviews';
import receiveReviews from '../action-creators/receiveReviews';
import reviewsByHash from './reviewsByHash';

const firstMeta = {
  requestId: 1,
  offset: 0,
  sort: 'dateDesc',
  filterMedia: true,
};

/**
 * @returns The state after the first page of a filtered list was received.
 */
const receiveFilteredFirstPage = () => {
  const requested = reviewsByHash({}, requestReviews('hash', firstMeta));

  return reviewsByHash(requested, receiveReviews('hash', 'foo', [{
    id: 1,
    rate: 80,
  }], 7, firstMeta));
};

describe('Reviews reducers: reviewsByHash query', () => {
  it('should record the requested media filter and the filter of the received list', () => {
    const requested = reviewsByHash({}, requestReviews('hash', firstMeta));

    expect(requested.hash.requestFilterMedia).toBe(true);
    expect(requested.hash.filterMedia).toBeUndefined();
    expect(receiveFilteredFirstPage().hash.filterMedia).toBe(true);
  });

  it('should clear the filter of the list when an unfiltered first page is received', () => {
    const meta = {
      requestId: 2,
      offset: 0,
      sort: 'dateDesc',
    };

    const requested = reviewsByHash(receiveFilteredFirstPage(), requestReviews('hash', meta));
    expect(requested.hash.requestFilterMedia).toBeUndefined();
    expect(requested.hash.filterMedia).toBe(true);

    const received = reviewsByHash(requested, receiveReviews('hash', 'foo', [{
      id: 2,
      rate: 60,
    }], 30, meta));

    expect(received.hash.filterMedia).toBeUndefined();
    expect(received.hash.reviews).toEqual([2]);
  });

  it('should append a later page of the same filter', () => {
    const meta = {
      requestId: 2,
      offset: 1,
      sort: 'dateDesc',
      filterMedia: true,
    };

    const requested = reviewsByHash(receiveFilteredFirstPage(), requestReviews('hash', meta));
    const received = reviewsByHash(requested, receiveReviews('hash', 'foo', [{
      id: 2,
      rate: 60,
    }], 7, meta));

    expect(received.hash.reviews).toEqual([1, 2]);
  });

  it('should not append a later page of another filter', () => {
    const meta = {
      requestId: 2,
      offset: 1,
      sort: 'dateDesc',
    };

    const requested = reviewsByHash(receiveFilteredFirstPage(), requestReviews('hash', meta));
    const received = reviewsByHash(requested, receiveReviews('hash', 'foo', [{
      id: 2,
      rate: 60,
    }], 30, meta));

    expect(received.hash.reviews).toEqual([1]);
    expect(received.hash.isFetching).toBe(false);
  });
});
