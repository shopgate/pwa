// fetchProductsById.d.ts

import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

export interface FetchProductsResult {
  products: any[];
  totalProductCount: number;
}

export interface FetchProductsConfig {
  /**
   * Array of product IDs to fetch.
   */
  productIds: string[];
  /**
   * Optional unique identifier for the component making the request.
   */
  componentId?: string | null;
  /**
   * Whether to cache the result by hash.
   */
  cached?: boolean;
  /**
   * Whether to include fulfillment information in the response.
   */
  includeFulfillment?: boolean;
  /**
   * Optional type of the product IDs. Needs only to be set if the product IDs are not regular
   * product IDs.
   */
  productIdType?: 'id' | 'sku' | 'ean' | 'upc';
}

/**
 * Dispatches a fetch products action to retrieve products by their IDs.
 */
declare function fetchProductsById(
  options: FetchProductsConfig
): ThunkAction<Promise<FetchProductsResult | void>, any, unknown, AnyAction>;

/**
 * Dispatches a fetch products action to retrieve products by their IDs.
 * @deprecated Use the object-based API instead.
 */
declare function fetchProductsById(
  /**
   * Array of product IDs to fetch.
   */
  productIds: string[],
  /**
   * Optional unique identifier for the component making the request.
   */
  componentId?: string | null,
  /**
   * Whether to cache the result by hash.
   */
  cached?: boolean,
  /**
   * Whether to include fulfillment information in the response.
   */
  includeFulfillment?: boolean
): ThunkAction<Promise<FetchProductsResult | void>, any, unknown, AnyAction>;

export default fetchProductsById;
