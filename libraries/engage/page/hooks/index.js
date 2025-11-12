import {
  useContext, useMemo, useCallback, useEffect, useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { WidgetContext } from '@shopgate/engage/page/components/Widgets';
import { ITEMS_PER_LOAD } from '@shopgate/engage/core/constants';
import { transformDisplayOptions } from '@shopgate/engage/core/helpers';
import { fetchProductsByQuery } from '@shopgate/engage/product';
import { makeGetWidgetProducts } from '../selectors';

/**
 * @typedef {import('../components/Widgets/WidgetContext').WidgetContextType WidgetContextType}
 */

/**
 * @typedef {import('./index').UseWidgetProductsOptions} UseWidgetProductsOptions
 */

/**
 * @typedef {import('./index').UseWidgetProductsResult} UseWidgetProductsResult
 */

/**
 * The useWidget hook provides access to the context that is wrapped around a widget.
 * @returns {WidgetContextType} The widget context.
 */
export const useWidget = () => useContext(WidgetContext);

const REQUEST_TYPE_MAPPING = {
  highlights: 1,
  searchTerm: 2,
  brand: 3,
  productIds: 4,
  category: 5,
};

/**
 * Retrieves the products for the current widget.
 * @param {UseWidgetProductsOptions} options Hook options
 * @returns {UseWidgetProductsResult} The products and a function to fetch more products.
 */
export const useWidgetProducts = (options = {}) => {
  const {
    type,
    value,
    limit = ITEMS_PER_LOAD,
    sort = 'relevance',
  } = options;

  const dispatch = useDispatch();
  const { code = `${type}_${value}_${limit}_${sort}`, isPreview } = useWidget();

  // ###### Products selection ######

  const selectorOptions = useMemo(() => ({
    sort: transformDisplayOptions(sort),
    value,
    useDefaultRequestForProductIds: true,
  }), [sort, value]);

  const getWidgetProducts = useMemo(
    () => makeGetWidgetProducts(type, selectorOptions, code),
    [code, selectorOptions, type]
  );

  const widgetProducts = useSelector(getWidgetProducts);

  // ###### Products request ######

  // Outside the preview mode the offset and hasNext state are initialized based on previously
  // fetched product data. That ensures that users see the same product list when they leave
  // the page and come back later.
  const [offset, setOffset] = useState(isPreview
    ? 0
    : widgetProducts.products.length);

  const [hasNext, setHasNext] = useState(isPreview
    ? true
    : widgetProducts.totalProductCount > widgetProducts.products.length);

  const { isFetching } = widgetProducts;

  const baseRequestOptions = useMemo(() => ({
    limit,
    sort: transformDisplayOptions(sort),
    useDefaultRequestForProductIds: true,
  }), [limit, sort]);

  /**
   * Callback to dispatch the initial fetch request for products when the hook mounts,
   * or when its parameters change.
   */
  const fetchInitial = useCallback(async () => {
    if (!value) {
      setHasNext(false);
      return;
    }

    // Initial request needs to start at offset 0
    const initialOptions = {
      ...baseRequestOptions,
      offset: 0,
    };

    const result = await dispatch(fetchProductsByQuery(
      REQUEST_TYPE_MAPPING[type],
      value,
      initialOptions,
      code
    ));

    // Re-initialize offset and hasNext based on the result
    setOffset(limit);
    // When the result comes from a real pipeline request there will be "totalProductCount".
    // When the result are cached products, it can also be "totalResultCount".
    setHasNext((result?.totalProductCount ?? result?.totalResultCount) > limit);
  }, [code, dispatch, type, value, limit, baseRequestOptions]);

  // Effect to trigger the initial fetch when the component mounts or the parameters change.
  useEffect(() => {
    if ((!isPreview && offset === 0) || isPreview) {
      fetchInitial();
    }

  // This effect should only run at first render or when the fetchInitial callback updates.
  // fetchInitial will never be updated on a real "page" at runtime since its dependencies
  // are static.
  // In preview mode updates of fetchInitial are an essential part of the preview system.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchInitial]);

  /**
   * Callback to fetch the next chunk of products when e.g. users interacted with a "Load More"
   * button.
   */
  const fetchNext = useCallback(async () => {
    if (!hasNext || isFetching || !value) {
      return;
    }

    const nextOptions = {
      ...baseRequestOptions,
      offset,
    };

    const result = await dispatch(fetchProductsByQuery(
      REQUEST_TYPE_MAPPING[type],
      value,
      nextOptions,
      code
    ));

    setOffset(offset + limit);
    // When the result comes from a real pipeline request there will be "totalProductCount".
    // When the result are cached products, it can also be "totalResultCount".
    setHasNext((result?.totalProductCount ?? result?.totalResultCount) > offset + limit);
  }, [
    code,
    dispatch,
    hasNext,
    isFetching,
    value,
    offset,
    limit,
    baseRequestOptions,
    type,
  ]);

  return {
    fetchNext,
    hasNext,
    isFetching,
    results: widgetProducts.products.slice(0, offset),
    totalResultCount: widgetProducts.totalProductCount,
  };
};
