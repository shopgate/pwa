import requestReviews from '../action-creators/requestReviews';
import receiveReviews from '../action-creators/receiveReviews';
import errorReviews from '../action-creators/errorReviews';
import reviewsByHash from './reviewsByHash';

const meta = {
  requestId: 1,
  offset: 0,
  sort: 'dateDesc',
};

/**
 * @param after The cursor returned with the first page.
 * @returns The state after a first page was requested and received.
 */
const receiveFirstPage = (after?: string | null) => {
  const requested = reviewsByHash({}, requestReviews('hash', meta));

  return reviewsByHash(requested, receiveReviews('hash', 'foo', [{
    id: 1,
    rate: 80,
  }], 30, meta, after));
};

describe('Reviews reducers: reviewsByHash cursor', () => {
  it('should store the cursor of a received page', () => {
    expect(receiveFirstPage('next').hash.after).toBe('next');
  });

  it('should store no cursor when the response has none', () => {
    expect(receiveFirstPage().hash.after).toBeNull();
    expect(receiveFirstPage(null).hash.after).toBeNull();
    expect(receiveFirstPage('').hash.after).toBeNull();
  });

  it('should keep the cursor while the next page is requested and when it fails', () => {
    const nextMeta = {
      requestId: 2,
      offset: 1,
      sort: 'dateDesc',
    };

    const requested = reviewsByHash(receiveFirstPage('next'), requestReviews('hash', nextMeta));
    expect(requested.hash.after).toBe('next');

    const failed = reviewsByHash(requested, errorReviews('hash', nextMeta));
    expect(failed.hash.after).toBe('next');
  });

  it('should replace the cursor with the one of the next page and clear it on the last page', () => {
    const nextMeta = {
      requestId: 2,
      offset: 1,
      sort: 'dateDesc',
    };

    const requested = reviewsByHash(receiveFirstPage('next'), requestReviews('hash', nextMeta));
    const second = reviewsByHash(requested, receiveReviews('hash', 'foo', [{
      id: 2,
      rate: 60,
    }], 30, nextMeta, 'last'));

    expect(second.hash.reviews).toEqual([1, 2]);
    expect(second.hash.after).toBe('last');

    const lastMeta = {
      requestId: 3,
      offset: 2,
      sort: 'dateDesc',
    };
    const requestedLast = reviewsByHash(second, requestReviews('hash', lastMeta));
    const last = reviewsByHash(requestedLast, receiveReviews('hash', 'foo', [{
      id: 3,
      rate: 40,
    }], 30, lastMeta));

    expect(last.hash.reviews).toEqual([1, 2, 3]);
    expect(last.hash.after).toBeNull();
  });

  it('should not let an outdated response overwrite the cursor', () => {
    const nextMeta = {
      requestId: 2,
      offset: 1,
      sort: 'dateDesc',
    };
    const newerMeta = {
      requestId: 3,
      offset: 0,
      sort: 'dateDesc',
    };

    const requested = reviewsByHash(receiveFirstPage('next'), requestReviews('hash', nextMeta));
    const requestedAgain = reviewsByHash(requested, requestReviews('hash', newerMeta));
    const outdated = reviewsByHash(requestedAgain, receiveReviews('hash', 'foo', [{
      id: 2,
      rate: 60,
    }], 30, nextMeta, 'outdated'));

    expect(outdated.hash.after).toBe('next');
    expect(outdated.hash.reviews).toEqual([1]);
  });

  it('should replace list and cursor when a first page is received again', () => {
    const againMeta = {
      requestId: 2,
      offset: 0,
      sort: 'dateDesc',
    };

    const requested = reviewsByHash(receiveFirstPage('next'), requestReviews('hash', againMeta));
    const again = reviewsByHash(requested, receiveReviews('hash', 'foo', [{
      id: 9,
      rate: 100,
    }], 30, againMeta, 'fresh'));

    expect(again.hash.reviews).toEqual([9]);
    expect(again.hash.after).toBe('fresh');
  });
});
