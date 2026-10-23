import receiveProductReviews from '../action-creators/receiveProductReviews';
import receiveReviews from '../action-creators/receiveReviews';
import reviewSummariesByProductId from './reviewSummariesByProductId';

const summary = {
  average: 69,
  count: 35,
};

describe('Reviews reducers: reviewSummariesByProductId', () => {
  it('should start empty and ignore other actions', () => {
    const state = reviewSummariesByProductId(undefined, { type: '@@init' });

    expect(state).toEqual({});
    expect(reviewSummariesByProductId(state, { type: 'RESET_APP' })).toBe(state);
  });

  it('should store the summary of a received preview by product id', () => {
    const state = reviewSummariesByProductId({}, receiveProductReviews('foo', [], 35, {}, summary));

    expect(state).toEqual({ foo: summary });
  });

  it('should store the summary of a received list and replace an older one', () => {
    const state = reviewSummariesByProductId(
      { foo: summary },
      receiveReviews('hash', 'foo', [], 36, {}, null, {
        average: 70,
        count: 36,
      })
    );

    expect(state).toEqual({
      foo: {
        average: 70,
        count: 36,
      },
    });
  });

  it('should keep the stored summary when a response has none or an invalid one', () => {
    const state = { foo: summary };

    expect(reviewSummariesByProductId(state, receiveProductReviews('foo', [], 35))).toBe(state);
    expect(reviewSummariesByProductId(state, receiveReviews('hash', 'foo', [], 35))).toBe(state);
    expect(reviewSummariesByProductId(
      state,
      receiveReviews('hash', 'foo', [], 35, {}, null, { count: 3 })
    )).toBe(state);
  });

  it('should keep the stored object when the same numbers arrive again', () => {
    const stored = {
      average: 69,
      count: 35,
      distribution: {
        5: 10,
        4: 10,
        3: 5,
        2: 5,
        1: 5,
      },
    };
    const state = { foo: stored };

    const next = reviewSummariesByProductId(state, receiveReviews('hash', 'foo', [], 35, {}, null, {
      average: 69,
      count: 35,
      distribution: { ...stored.distribution },
    }));

    expect(next).toBe(state);
    expect(next.foo).toBe(stored);
  });

  it('should keep the summaries of other products', () => {
    const state = reviewSummariesByProductId(
      { foo: summary },
      receiveProductReviews('bar', [], 1, {}, {
        average: 100,
        count: 1,
      })
    );

    expect(Object.keys(state)).toEqual(['foo', 'bar']);
  });
});
