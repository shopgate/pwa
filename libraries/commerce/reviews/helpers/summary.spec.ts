import { normalizeReviewSummary } from './summary';

const distribution = {
  5: 10,
  4: 10,
  3: 5,
  2: 5,
  1: 5,
};

describe('Reviews helpers: normalizeReviewSummary', () => {
  it('should keep average, count and a complete distribution', () => {
    expect(normalizeReviewSummary({
      average: 69,
      count: 35,
      distribution,
      other: 'ignored',
    })).toEqual({
      average: 69,
      count: 35,
      distribution,
    });
  });

  it('should keep zero values', () => {
    expect(normalizeReviewSummary({
      average: 0,
      count: 0,
      distribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    })).toEqual({
      average: 0,
      count: 0,
      distribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    });
  });

  it('should return a summary without count and distribution when they are missing', () => {
    expect(normalizeReviewSummary({ average: 80 })).toEqual({
      average: 80,
      count: null,
    });
  });

  it('should drop a count that is no number of at least 0', () => {
    ['35', -3, NaN, Infinity, null].forEach((count) => {
      expect(normalizeReviewSummary({
        average: 80,
        count,
      })).toEqual({
        average: 80,
        count: null,
      });
    });
  });

  it('should copy the distribution instead of keeping the response object', () => {
    const result = normalizeReviewSummary({
      average: 69,
      distribution,
    });

    expect(result?.distribution).toEqual(distribution);
    expect(result?.distribution).not.toBe(distribution);
  });

  it('should drop a distribution that is incomplete or has invalid counts', () => {
    const { 3: omitted, ...incomplete } = distribution;

    [
      incomplete,
      {
        ...distribution,
        2: -1,
      },
      {
        ...distribution,
        1: '5',
      },
      [10, 10, 5, 5, 5],
      'none',
      null,
    ].forEach((value) => {
      expect(normalizeReviewSummary({
        average: 69,
        count: 35,
        distribution: value,
      })).toEqual({
        average: 69,
        count: 35,
      });
    });
    expect(omitted).toBe(5);
  });

  it('should return null without a numeric average', () => {
    [undefined, null, 'summary', 12, {}, { count: 3 }, { average: '80' }, { average: NaN }]
      .forEach((value) => {
        expect(normalizeReviewSummary(value)).toBeNull();
      });
  });
});
