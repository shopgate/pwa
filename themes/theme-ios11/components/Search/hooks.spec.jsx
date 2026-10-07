import { render, act } from '@testing-library/react';
import { useDebouncedValue, useSearchHistory, useSubmitSearch } from './hooks';

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockRoute = { pattern: '/browse' };
let mockRouteListener = null;
let mockStored;

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: selector => selector(),
  shallowEqual: () => true,
}));
jest.mock('@shopgate/engage/core/hooks', () => {
  const { useState } = jest.requireActual('react');
  return {
    useLocalStorage: (key, { initialValue }) => useState(mockStored ?? initialValue),
    useNavigation: () => ({
      push: mockPush,
      replace: mockReplace,
    }),
  };
});
jest.mock('@shopgate/engage/product', () => ({
  buildFetchSearchResultsParams: () => ({}),
}));
jest.mock('@shopgate/engage/search/constants', () => ({
  SEARCH_PATH: '/search',
  SEARCH_PATTERN: '/search',
}));
jest.mock('@shopgate/engage/search/actions', () => ({
  fetchSearchResults: jest.fn(),
  fetchSearchSuggestions: jest.fn(),
}));
jest.mock('@shopgate/engage/search/selectors', () => ({
  getSuggestions: jest.fn(),
}));
jest.mock('@shopgate/pwa-common/selectors/router', () => ({
  getCurrentRoute: () => mockRoute,
}));
jest.mock('@shopgate/pwa-common/streams/router', () => ({
  routeDidEnter$: {
    subscribe: (listener) => {
      mockRouteListener = listener;
      return {
        unsubscribe: () => {
          mockRouteListener = null;
        },
      };
    },
  },
}));
jest.mock('@shopgate/pwa-common-commerce/product/selectors/product', () => ({
  getProductById: jest.fn(),
  getProductsResult: jest.fn(),
}));

/**
 * Renders a hook and exposes its latest result.
 * @param {Function} useHook The hook.
 * @param {*} props Props for the hook.
 * @returns {Object} Holder of the latest result and a rerender function.
 */
const renderHook = (useHook, props) => {
  const result = { current: null };
  /**
   * @param {Object} hookProps The hook props.
   * @returns {null}
   */
  // eslint-disable-next-line react/prop-types
  const Harness = ({ hookProps }) => {
    result.current = useHook(hookProps);
    return null;
  };
  const { rerender } = render(<Harness hookProps={props} />);
  return {
    result,
    rerender: next => rerender(<Harness hookProps={next} />),
  };
};

describe('useSearchHistory', () => {
  afterEach(() => {
    mockStored = undefined;
  });

  it('adds terms newest first and moves repeated terms to the top', () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => result.current.addTerm('Jacket'));
    act(() => result.current.addTerm(' Beanie '));
    act(() => result.current.addTerm('jacket'));

    expect(result.current.history).toEqual(['jacket', 'Beanie']);
  });

  it('ignores empty terms', () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => result.current.addTerm('   '));

    expect(result.current.history).toEqual([]);
  });

  it('keeps the latest ten terms', () => {
    const { result } = renderHook(() => useSearchHistory());

    for (let i = 1; i <= 12; i += 1) {
      act(() => result.current.addTerm(`term ${i}`));
    }

    expect(result.current.history).toHaveLength(10);
    expect(result.current.history[0]).toBe('term 12');
    expect(result.current.history[9]).toBe('term 3');
  });

  it('cleans up stored terms that are no text, repeated or too many', () => {
    mockStored = ['Jacket', 'jacket ', 5, null, '', ...Array.from({ length: 20 }, (_, index) => `term ${index}`)];
    const { result } = renderHook(useSearchHistory);

    expect(result.current.history).toHaveLength(10);
    expect(result.current.history.slice(0, 2)).toEqual(['Jacket', 'term 0']);
  });

  it('clears the history', () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => result.current.addTerm('Jacket'));
    act(() => result.current.clearHistory());

    expect(result.current.history).toEqual([]);
  });
});

describe('useDebouncedValue', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('applies typed values after a pause', () => {
    const { result, rerender } = renderHook(
      ({ value, key }) => useDebouncedValue(value, key),
      {
        value: 'be',
        key: 1,
      }
    );

    rerender({
      value: 'bea',
      key: 1,
    });
    expect(result.current).toBe('be');

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('bea');
  });

  it('applies a value right away when the reset key changes', () => {
    const { result, rerender } = renderHook(
      ({ value, key }) => useDebouncedValue(value, key),
      {
        value: '',
        key: 1,
      }
    );

    rerender({
      value: 'Beanie',
      key: 2,
    });

    expect(result.current).toBe('Beanie');
  });
});

describe('useSubmitSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouteListener = null;
  });

  it('opens new results from other pages', () => {
    mockRoute = { pattern: '/browse' };
    const { result } = renderHook(() => useSubmitSearch());

    result.current.submit('red shoes');

    expect(mockPush).toHaveBeenCalledWith({ pathname: '/search?s=red%20shoes' });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('replaces the results when a search starts on the results page', () => {
    mockRoute = { pattern: '/search' };
    const { result } = renderHook(() => useSubmitSearch());

    result.current.submit('Jacke & Mütze');

    expect(mockReplace).toHaveBeenCalledWith({ pathname: '/search?s=Jacke%20%26%20M%C3%BCtze' });
  });

  it('opens the filters once the results entered', () => {
    mockRoute = { pattern: '/browse' };
    const { result } = renderHook(() => useSubmitSearch());

    result.current.submitWithFilters('Beanie');
    mockRouteListener({
      action: {
        route: {
          id: 'r1',
          pattern: '/search',
          query: { s: 'Beanie' },
        },
      },
    });

    expect(mockPush).toHaveBeenLastCalledWith({
      pathname: '/search/filter?s=Beanie',
      state: {
        filters: null,
        parentId: 'r1',
      },
    });
    expect(mockRouteListener).toBeNull();
  });

  it('gives up on the filters when another page enters first', () => {
    mockRoute = { pattern: '/browse' };
    const { result } = renderHook(() => useSubmitSearch());

    result.current.submitWithFilters('Beanie');
    mockRouteListener({
      action: {
        route: {
          id: 'r2',
          pattern: '/',
        },
      },
    });

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockRouteListener).toBeNull();
  });
});
