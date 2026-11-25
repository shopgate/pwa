import { getProductDataById } from '@shopgate/engage/product/selectors/product';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import type { AppThunk } from '@shopgate/engage/core/types';
import fetchProducts, { isProductIdentifiersProductIdType } from './fetchProducts';

/**
 * The products that `fetchProductsById` fetched or found in the store.
 */
export interface FetchProductsResult {
  /**
   * The products.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: any[];
  /**
   * The number of products.
   */
  totalProductCount: number;
}

/**
 * The options of `fetchProductsById`.
 */
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
 * What the thunk of `fetchProductsById` returns: the products from the store when all of them
 * are there, otherwise the request. Null when the request was skipped.
 */
export type FetchProductsByIdThunk = AppThunk<
  FetchProductsResult | Promise<FetchProductsResult> | null
>;

/**
 * Dispatches a fetch products action to retrieve products by their IDs.
 * @param options The action options.
 * @returns A Redux Thunk
 */
function fetchProductsById(options: FetchProductsConfig): FetchProductsByIdThunk;

/**
 * Dispatches a fetch products action to retrieve products by their IDs.
 * @param productIds The product id's to request
 * @param componentId A unique id for the component that is using this action
 * @param cached Whether to cache the result by hash
 * @param includeFulfillment Whether to include fulfillment data to the request
 * @returns A Redux Thunk
 * @deprecated Use the object-based API instead.
 */
function fetchProductsById(
  productIds: string[],
  componentId?: string | null,
  cached?: boolean,
  includeFulfillment?: boolean
): FetchProductsByIdThunk;

/**
 * Dispatches a fetch products action to retrieve products by their IDs.
 * @param optionsOrProductIds Action options or an array of product IDs (deprecated)
 * @param componentId (deprecated) A unique id for the component that is using this action
 * @param cached (deprecated) Whether to cache the result by hash
 * @param includeFulfillment (deprecated) Whether to include fulfillment data to the request
 * @returns A Redux Thunk
 */
function fetchProductsById(
  optionsOrProductIds: FetchProductsConfig | string[],
  componentId: string | null = null,
  cached = true,
  includeFulfillment = true
): FetchProductsByIdThunk {
  return (dispatch, getState) => {
    let localProductIds: string[] | undefined;
    let localComponentId: string | null | undefined;
    let localCached: boolean | undefined;
    let localIncludeFulfillment: boolean | undefined;
    let productIdType: FetchProductsConfig['productIdType'];

    if (Array.isArray(optionsOrProductIds)) {
      // Backwards compatibility for previous implementation where the function had a parameter list
      localProductIds = optionsOrProductIds;
      localComponentId = componentId || null;
      localCached = cached !== undefined ? cached : true;
      localIncludeFulfillment = includeFulfillment !== undefined ? includeFulfillment : true;
    } else if (typeof optionsOrProductIds === 'object' && optionsOrProductIds !== null) {
      // New object parameter mode
      ({
        productIds: localProductIds,
        componentId: localComponentId = null,
        cached: localCached = true,
        includeFulfillment: localIncludeFulfillment = true,
        productIdType,
      } = optionsOrProductIds);
    }

    let requestProductIds = localProductIds as string[];

    // When the productIds are regular product IDs, we can check the Redux store for existing
    // and only request the missing ones. That certainly doesn't work for SKUs, EANs or UPCs,
    if (!isProductIdentifiersProductIdType(productIdType as string)) {
      const state = getState();
      const products = (state.product as {
        productsById: Record<string, Parameters<typeof shouldFetchData>[0]>;
      }).productsById;

      // Filter out only the products that are not yet available in the store.
      requestProductIds = (localProductIds as string[]).filter(id => shouldFetchData(products[id]));

      // Then only perform a pipeline request if there are products missing.
      if (!requestProductIds.length) {
        const productsById = (localProductIds as string[]).map(
          id => getProductDataById(state, { productId: id })
        );
        const totalProductCount = productsById.length;
        return {
          products: productsById,
          totalProductCount,
        };
      }
    }

    return dispatch(fetchProducts({
      ...localComponentId && { id: localComponentId },
      cached: localCached,
      params: {
        productIds: requestProductIds,
        ...productIdType && { productIdType },
      },
      includeFulfillment: localIncludeFulfillment,
      includeFilters: false,
      includeSort: false,
      calledByFetchProductsById: true,
    })) as unknown as Promise<FetchProductsResult> | null;
  };
}

export default fetchProductsById;
