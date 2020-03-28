/* eslint-disable extra-rules/no-single-line-objects */
import { shouldFetchData } from '../shouldFetchData';

describe('shouldFetchData', () => {
  describe('should return false', () => {
    const tests = [
      ['when currently fetching', { isFetching: true }],
      ['when not yet expired', { items: Array(10), totalResultCount: 20, expires: Date.now() + 1e3 }],
      [
        'when not yet expired and requiredCount pass',
        { items: Array(10), totalResultCount: 20, expires: Date.now() + 1e3 },
        10,
      ],
      ['when enough items in store', { items: Array(10), totalResultCount: 20 }],
      ['when enough items in store by requiredCount',
        { items: Array(20), totalResultCount: 20 },
        20,
      ],
    ];

    tests.forEach(([title, item, requiredCount = null]) => {
      it(`should return false ${title}`, () => {
        expect(shouldFetchData(item, 'items', requiredCount)).toBeFalsy();
      });
    });
  });

  describe('should return true', () => {
    const tests = [
      ['when item is empty', null],
      ['when item is empty object', {}],
      ['when not cached: expire=0', { isFetching: false, expires: 0 }],
      ['when expired', { isFetching: false, expires: Date.now() - 1e3 }],
      [
        'when totalResultCount is less then items count',
        { items: Array(10), totalResultCount: 5 }],
      [
        'when requiredCount is less then items count',
        { items: Array(10), totalResultCount: 5 },
        5,
      ],
    ];

    tests.forEach(([title, item, requiredCount = null]) => {
      it(`should return true ${title}`, () => {
        expect(shouldFetchData(item, 'items', requiredCount)).toBeTruthy();
      });
    });
  });
});
/* eslint-enable extra-rules/no-single-line-objects */

