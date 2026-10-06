import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import { useLocalStorage } from '@shopgate/engage/core/hooks';
import { buildFetchSearchResultsParams } from '@shopgate/engage/product';
import fetchSearchResults from '@shopgate/pwa-common-commerce/search/actions/fetchSearchResults';
import fetchSearchSuggestions from '@shopgate/pwa-common-commerce/search/actions/fetchSearchSuggestions';
import { getSuggestions } from '@shopgate/pwa-common-commerce/search/selectors';
import { getProductById } from '@shopgate/pwa-common-commerce/product/selectors/product';
import {
  SEARCH_DEBOUNCE, SEARCH_HISTORY_MAX, SEARCH_MIN_CHARS, SEARCH_PREVIEW_LIMIT,
} from './constants';

const EMPTY_HISTORY = [];
const EMPTY_PREVIEW = {
  productIds: [],
  totalProductCount: null,
  isLoading: false,
};
const PREVIEW_RETRIES = 20;
const PREVIEW_RETRY_DELAY = 500;

/**
 * The search terms the visitor submitted, newest first.
 * @returns {Object} The history with functions to add a term and to clear it.
 */
export const useSearchHistory = () => {
  const [stored, setStored] = useLocalStorage('search-history', { initialValue: EMPTY_HISTORY });
  const history = Array.isArray(stored) ? stored : EMPTY_HISTORY;

  const addTerm = useCallback((term) => {
    const value = term.trim();
    if (!value) {
      return;
    }

    setStored((previous) => {
      const list = Array.isArray(previous) ? previous : [];
      const rest = list.filter(entry => entry.toLowerCase() !== value.toLowerCase());
      return [value, ...rest].slice(0, SEARCH_HISTORY_MAX);
    });
  }, [setStored]);

  const clearHistory = useCallback(() => {
    setStored(EMPTY_HISTORY);
  }, [setStored]);

  return {
    history,
    addTerm,
    clearHistory,
  };
};

/**
 * Debounces a value.
 * @param {string} value The value.
 * @returns {string} The value after it stopped changing.
 */
const useDebouncedValue = (value) => {
  const [debounced, setDebounced] = useState(value);
  const update = useMemo(() => debounce(setDebounced, SEARCH_DEBOUNCE), []);

  useEffect(() => {
    update(value);
  }, [update, value]);

  useEffect(() => () => update.cancel(), [update]);

  return debounced;
};

/**
 * Keyword suggestions for a search phrase.
 * @param {string} phrase The search phrase.
 * @returns {string[]} The suggestions.
 */
export const useSearchSuggestions = (phrase) => {
  const dispatch = useDispatch();
  const searchPhrase = useDebouncedValue(phrase.trim());
  const enabled = searchPhrase.length >= SEARCH_MIN_CHARS;
  const suggestions = useSelector(state => (
    enabled ? getSuggestions(state, { searchPhrase }) : null
  ));

  useEffect(() => {
    if (enabled) {
      dispatch(fetchSearchSuggestions(searchPhrase));
    }
  }, [dispatch, enabled, searchPhrase]);

  return suggestions || EMPTY_HISTORY;
};

/**
 * Requests the first products of a search. Resolves with the product ids and the total count, or
 * with null while the same request is still running.
 * @param {Function} dispatch The redux dispatch function.
 * @param {string} searchPhrase The search phrase.
 * @returns {Promise<Object|null>}
 */
const requestPreview = (dispatch, searchPhrase) => Promise.resolve(dispatch(fetchSearchResults({
  ...buildFetchSearchResultsParams(),
  searchPhrase,
  limit: SEARCH_PREVIEW_LIMIT,
  filters: null,
}))).then((result) => {
  if (!result || !Array.isArray(result.products)) {
    return null;
  }

  return {
    productIds: result.products
      .map(product => (typeof product === 'string' ? product : product?.id))
      .filter(Boolean)
      .slice(0, SEARCH_PREVIEW_LIMIT),
    totalProductCount: result.totalProductCount ?? result.totalResultCount ?? null,
  };
});

/**
 * The first products of a search, shown while the visitor types.
 * @param {string} phrase The search phrase.
 * @returns {Object} Products, total count and loading state of the preview.
 */
export const useSearchPreview = (phrase) => {
  const dispatch = useDispatch();
  const searchPhrase = useDebouncedValue(phrase.trim());
  const [preview, setPreview] = useState(EMPTY_PREVIEW);

  useEffect(() => {
    if (searchPhrase.length < SEARCH_MIN_CHARS) {
      setPreview(EMPTY_PREVIEW);
      return undefined;
    }

    let active = true;
    let retryTimer = null;
    setPreview(current => ({
      ...current,
      isLoading: true,
    }));

    /**
     * @param {number} attempt The number of the attempt.
     */
    const load = (attempt) => {
      requestPreview(dispatch, searchPhrase)
        .then((result) => {
          if (!active) {
            return;
          }

          if (!result) {
            if (attempt < PREVIEW_RETRIES) {
              retryTimer = setTimeout(() => load(attempt + 1), PREVIEW_RETRY_DELAY);
            } else {
              setPreview(EMPTY_PREVIEW);
            }
            return;
          }

          setPreview({
            ...result,
            isLoading: false,
          });
        })
        .catch(() => {
          if (active) {
            setPreview(EMPTY_PREVIEW);
          }
        });
    };

    load(0);

    return () => {
      active = false;
      clearTimeout(retryTimer);
    };
  }, [dispatch, searchPhrase]);

  const products = useSelector(state => preview.productIds
    .map(productId => getProductById(state, { productId })?.productData)
    .filter(Boolean), shallowEqual);

  return {
    products,
    totalProductCount: preview.totalProductCount,
    isLoading: preview.isLoading,
    isPending: phrase.trim() !== searchPhrase,
  };
};
