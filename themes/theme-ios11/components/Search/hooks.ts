import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import { useLocalStorage, useNavigation } from '@shopgate/engage/core/hooks';
import { buildFetchSearchResultsParams } from '@shopgate/engage/product';
import { SEARCH_PATH, SEARCH_PATTERN } from '@shopgate/engage/search/constants';
import { fetchSearchResults, fetchSearchSuggestions } from '@shopgate/engage/search/actions';
import { getSuggestions } from '@shopgate/engage/search/selectors';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { routeDidEnter$ } from '@shopgate/pwa-common/streams/router';
import {
  getProductById,
  getProductsResult,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import {
  SEARCH_DEBOUNCE,
  SEARCH_HISTORY_MAX,
  SEARCH_MIN_CHARS,
  SEARCH_PREVIEW_LIMIT,
  SEARCH_PREVIEW_RETRIES,
  SEARCH_PREVIEW_RETRY_DELAY,
} from './constants';

interface PreviewResult {
  productIds: string[];
  totalProductCount: number | null;
}

interface PreviewState extends PreviewResult {
  isLoading: boolean;
}

/**
 * The first products of a search.
 */
export interface SearchPreview {
  products: Array<Record<string, unknown> & { id: string }>;
  totalProductCount: number | null;
  isLoading: boolean;
}

interface ProductLike {
  id?: string;
}

interface ProductsResult {
  products?: Array<ProductLike | string> | null;
  totalProductCount?: number | null;
  totalResultCount?: number | null;
}

interface Route {
  id: string;
  pattern?: string;
  query?: Record<string, string>;
}

type Dispatch = (action: unknown) => unknown;
type GetState = () => unknown;

const EMPTY_HISTORY: string[] = [];
const EMPTY_SUGGESTIONS: string[] = [];
const EMPTY_PREVIEW: PreviewState = {
  productIds: [],
  totalProductCount: null,
  isLoading: false,
};

/**
 * Reduces a products result to the preview.
 * @param result A products result of the store or of a request.
 * @returns The product ids and the total count, or null when the result holds no products yet.
 */
const toPreviewResult = (result?: ProductsResult | null): PreviewResult | null => {
  if (!result || !Array.isArray(result.products) || !result.products.length) {
    return null;
  }

  return {
    productIds: result.products
      .map(product => (typeof product === 'string' ? product : product?.id))
      .filter((id): id is string => !!id)
      .slice(0, SEARCH_PREVIEW_LIMIT),
    totalProductCount: result.totalProductCount ?? result.totalResultCount ?? null,
  };
};

/**
 * Requests the first products of a search. Products the store already holds for the search are
 * used right away.
 * @param searchPhrase The search phrase.
 * @returns A redux thunk that resolves with the preview, or with null while the same request
 * is still running.
 */
const fetchSearchPreview = (searchPhrase: string) => (
  dispatch: Dispatch,
  getState: GetState
): Promise<PreviewResult | null> => {
  const { params } = buildFetchSearchResultsParams() || {};
  const known = toPreviewResult(getProductsResult(getState(), {
    searchPhrase,
    params,
  }) as ProductsResult);

  if (known) {
    return Promise.resolve(known);
  }

  return Promise.resolve(dispatch(fetchSearchResults({
    ...buildFetchSearchResultsParams(),
    searchPhrase,
    limit: SEARCH_PREVIEW_LIMIT,
    filters: undefined,
  }))).then((result) => {
    if (!result || !Array.isArray((result as ProductsResult).products)) {
      return null;
    }

    return toPreviewResult(result as ProductsResult) ?? {
      productIds: [],
      totalProductCount: 0,
    };
  });
};

/**
 * Cleans up stored search terms.
 * @param stored The stored value.
 * @returns Up to ten different terms, newest first.
 */
const toHistory = (stored: unknown): string[] => {
  if (!Array.isArray(stored)) {
    return EMPTY_HISTORY;
  }

  const seen = new Set<string>();

  return stored.filter((entry): entry is string => {
    const key = typeof entry === 'string' ? entry.trim().toLowerCase() : '';
    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  }).slice(0, SEARCH_HISTORY_MAX);
};

/**
 * The search terms the visitor submitted, newest first.
 * @returns The history with functions to add a term and to clear it.
 */
export const useSearchHistory = () => {
  const [stored, setStored] = useLocalStorage<string[]>('search-history', {
    initialValue: EMPTY_HISTORY,
  });

  const history = useMemo(() => toHistory(stored), [stored]);

  const addTerm = useCallback((term: string) => {
    const value = term.trim();
    if (!value) {
      return;
    }

    setStored(previous => toHistory([value, ...(Array.isArray(previous) ? previous : [])]));
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
 * Debounces a value. A new reset key takes over the current value without delay.
 * @param value The value.
 * @param resetKey Changes whenever the value should apply immediately.
 * @returns The value after it stopped changing.
 */
export const useDebouncedValue = (value: string, resetKey: number): string => {
  const [state, setState] = useState({
    value,
    resetKey,
  });
  const update = useMemo(() => debounce((next: string) => {
    setState(current => ({
      ...current,
      value: next,
    }));
  }, SEARCH_DEBOUNCE), []);

  if (state.resetKey !== resetKey) {
    update.cancel();
    setState({
      value,
      resetKey,
    });
  }

  useEffect(() => {
    update(value);
  }, [update, value]);

  useEffect(() => () => update.cancel(), [update]);

  return state.resetKey === resetKey ? state.value : value;
};

/**
 * Keyword suggestions for a search phrase.
 * @param searchPhrase The debounced search phrase.
 * @returns The suggestions.
 */
export const useSearchSuggestions = (searchPhrase: string): string[] => {
  const dispatch = useDispatch();
  const enabled = searchPhrase.length >= SEARCH_MIN_CHARS;
  const suggestions = useSelector((state: unknown) => (
    enabled ? getSuggestions(state, { searchPhrase }) as string[] | null : null
  ));

  useEffect(() => {
    if (enabled) {
      dispatch(fetchSearchSuggestions(searchPhrase) as never);
    }
  }, [dispatch, enabled, searchPhrase]);

  return suggestions || EMPTY_SUGGESTIONS;
};

/**
 * The first products of a search, shown while the visitor types.
 * @param searchPhrase The debounced search phrase.
 * @returns Products, total count and loading state of the preview.
 */
export const useSearchPreview = (searchPhrase: string): SearchPreview => {
  const dispatch = useDispatch();
  const [preview, setPreview] = useState<PreviewState>(EMPTY_PREVIEW);

  useEffect(() => {
    if (searchPhrase.length < SEARCH_MIN_CHARS) {
      setPreview(EMPTY_PREVIEW);
      return undefined;
    }

    let active = true;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    setPreview(current => ({
      ...current,
      isLoading: true,
    }));

    /**
     * Loads the preview, and tries again while the same request is still running.
     * @param attempt The number of the attempt.
     */
    const load = (attempt: number) => {
      Promise.resolve(dispatch(fetchSearchPreview(searchPhrase) as never) as unknown)
        .then((result) => {
          if (!active) {
            return;
          }

          if (!result) {
            if (attempt < SEARCH_PREVIEW_RETRIES) {
              retryTimer = setTimeout(() => load(attempt + 1), SEARCH_PREVIEW_RETRY_DELAY);
            } else {
              setPreview({
                ...EMPTY_PREVIEW,
                totalProductCount: 0,
              });
            }
            return;
          }

          setPreview({
            ...(result as PreviewResult),
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

  const products = useSelector((state: unknown) => preview.productIds
    .map(productId => (
      getProductById(state, { productId }) as { productData?: Record<string, unknown> } | null
    )?.productData)
    .filter(Boolean), shallowEqual);

  return {
    products: products as SearchPreview['products'],
    totalProductCount: preview.totalProductCount,
    isLoading: preview.isLoading,
  };
};

/**
 * Opens the results of a search. A search started from the results replaces them, so the history
 * holds one results page. Filters of the current page are never carried over.
 * @returns Functions to open the results, and to open the results followed by their filters.
 */
export const useSubmitSearch = () => {
  const { push, replace } = useNavigation();
  const route = useSelector(getCurrentRoute) as Route | null;
  const isResultsPage = route?.pattern === SEARCH_PATTERN;

  const submit = useCallback((searchPhrase: string) => {
    const navigate = isResultsPage ? replace : push;
    navigate({ pathname: `${SEARCH_PATH}?s=${encodeURIComponent(searchPhrase)}` });
  }, [isResultsPage, push, replace]);

  const submitWithFilters = useCallback((searchPhrase: string) => {
    const subscription = routeDidEnter$.subscribe(({ action }: { action: { route?: Route } }) => {
      subscription.unsubscribe();
      const entered = action.route;

      if (entered?.pattern !== SEARCH_PATTERN || entered.query?.s !== searchPhrase) {
        return;
      }

      push({
        pathname: `${SEARCH_PATH}/filter?s=${encodeURIComponent(searchPhrase)}`,
        state: {
          filters: null,
          parentId: entered.id,
        },
      });
    });

    submit(searchPhrase);
  }, [push, submit]);

  return {
    submit,
    submitWithFilters,
  };
};
