import React from 'react';
import { render, act } from '@testing-library/react';
import { useSearchHistory } from './hooks';

/**
 * Renders the hook and exposes its latest result.
 * @returns {Object} Holder of the latest hook result.
 */
const renderHistory = () => {
  const result = { current: null };
  /**
   * @returns {null}
   */
  const Harness = () => {
    result.current = useSearchHistory();
    return null;
  };
  render(<Harness />);
  return { result };
};

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: () => null,
  shallowEqual: () => true,
}));
jest.mock('@shopgate/engage/core/hooks', () => {
  const { useState } = jest.requireActual('react');
  return {
    useLocalStorage: (key, { initialValue }) => useState(initialValue),
  };
});
jest.mock('@shopgate/engage/product', () => ({
  buildFetchSearchResultsParams: () => ({}),
}));
jest.mock('@shopgate/pwa-common-commerce/search/actions/fetchSearchResults', () => jest.fn());
jest.mock('@shopgate/pwa-common-commerce/search/actions/fetchSearchSuggestions', () => jest.fn());
jest.mock('@shopgate/pwa-common-commerce/search/selectors', () => ({
  getSuggestions: jest.fn(),
}));
jest.mock('@shopgate/pwa-common-commerce/product/selectors/product', () => ({
  getProductById: jest.fn(),
}));

describe('useSearchHistory', () => {
  it('adds terms newest first and moves repeated terms to the top', () => {
    const { result } = renderHistory();

    act(() => result.current.addTerm('Jacket'));
    act(() => result.current.addTerm(' Beanie '));
    act(() => result.current.addTerm('jacket'));

    expect(result.current.history).toEqual(['jacket', 'Beanie']);
  });

  it('ignores empty terms', () => {
    const { result } = renderHistory();

    act(() => result.current.addTerm('   '));

    expect(result.current.history).toEqual([]);
  });

  it('keeps the latest ten terms', () => {
    const { result } = renderHistory();

    for (let i = 1; i <= 12; i += 1) {
      act(() => result.current.addTerm(`term ${i}`));
    }

    expect(result.current.history).toHaveLength(10);
    expect(result.current.history[0]).toBe('term 12');
    expect(result.current.history[9]).toBe('term 3');
  });

  it('clears the history', () => {
    const { result } = renderHistory();

    act(() => result.current.addTerm('Jacket'));
    act(() => result.current.clearHistory());

    expect(result.current.history).toEqual([]);
  });
});
