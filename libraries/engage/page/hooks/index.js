import {
  useContext, useMemo, useCallback, useEffect, useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { WidgetContext } from '@shopgate/engage/page/components/Widgets';
import { showInventoryInLists } from '@shopgate/engage/locations/helpers';
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
  itemNumbers: 4,
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

  const { code = 'abc' } = useWidget();

  const showInventoryInProductLists = useSelector(showInventoryInLists);

  const selectorOptions = useMemo(() => ({
    sort: transformDisplayOptions(sort),
    value,
    ...(showInventoryInProductLists && {
      useDefaultRequestForProductIds: true,
    }),
  }), [showInventoryInProductLists, sort, value]);

  const getWidgetProducts = useMemo(
    () => makeGetWidgetProducts(type, selectorOptions, code),
    [code, selectorOptions, type]
  );

  const widgetProducts = useSelector(getWidgetProducts);

  const [hasNext, setHasNext] = useState(
    typeof widgetProducts.totalProductCount !== 'number' || widgetProducts.products.length < widgetProducts.totalProductCount
  );

  // const offset = Math.min(widgetProducts.products.length, widgetProducts.totalProductCount ?? 0);
  const offset = 0;

  const requestOptions = useMemo(() => ({
    limit,
    offset,
    sort: transformDisplayOptions(sort),
    ...(showInventoryInProductLists && {
      useDefaultRequestForProductIds: true,
    }),
  }), [limit, offset, showInventoryInProductLists, sort]);

  const fetchProducts = useCallback(async () => {
    console.warn('fectch', value, requestOptions, code, hasNext);
    if (!hasNext || !value) {
      return;
    }

    const result = await dispatch(fetchProductsByQuery(
      REQUEST_TYPE_MAPPING[type],
      value,
      requestOptions,
      code
    ));

    setHasNext(() => result.products.length >= requestOptions.limit);
  }, [code, dispatch, hasNext, requestOptions, type, value]);

  useEffect(() => {
    setHasNext(() => true);
    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, value, limit, sort]);

  return {
    fetchNext: fetchProducts,
    hasNext,
    isFetching: widgetProducts.isFetching,
    results: widgetProducts.products,
    totalResultCount: widgetProducts.totalProductCount,
  };
};
