import fetchFilters from '../actions/fetchFilters';
import { filterDidEnter$ } from '../streams';
import { SEARCH_FILTER_PATTERN } from '../../search/constants';
import subscriptions from './index';

jest.mock('../actions/fetchFilters', () => jest.fn().mockReturnValue('fetchFilters'));

describe('Filter subscriptions', () => {
  const subscribe = jest.fn();
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    subscriptions(subscribe);
  });

  it('should subscribe as expected', () => {
    expect(subscribe).toHaveBeenCalledTimes(1);
  });

  describe('filterDidEnter$', () => {
    let stream;
    let callback;

    beforeEach(() => {
      [[stream, callback]] = subscribe.mock.calls;
    });

    it('should setup as expected', () => {
      expect(stream).toEqual(filterDidEnter$);
      expect(callback).toBeInstanceOf(Function);
    });

    it('should call get filters when stream emits', () => {
      callback({ dispatch });
      expect(fetchFilters).toHaveBeenCalledTimes(1);
      expect(fetchFilters).toHaveBeenCalledWith({
        filters: null,
      });
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(fetchFilters({
        filters: null,
      }));
    });

    it('should fetch filters on the search filter page when a search phrase is present', () => {
      callback({
        dispatch,
        action: {
          route: {
            pattern: SEARCH_FILTER_PATTERN,
            query: { s: 'shoes' },
            state: {},
          },
        },
      });

      expect(fetchFilters).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(1);
    });

    it('should not fetch filters on the search filter page without a search phrase', () => {
      callback({
        dispatch,
        action: {
          route: {
            pattern: SEARCH_FILTER_PATTERN,
            query: { s: '' },
            state: {},
          },
        },
      });

      expect(fetchFilters).not.toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});
