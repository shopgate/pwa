import type { WidgetContextType } from '../components/Widgets/WidgetContext';

/**
 * The useWidget hook provides access to the context that is wrapped around a widget.
 * @returns The widget context.
 */
export declare function useWidget<C = Record<string, any>>(): WidgetContextType<C>


export type UseWidgetProductsOptions = {
  /**
   * The search value to use for the product search
   */
  value: string;
  /**
   * The type of product search to perform.
   */
  type: 'searchTerm' | 'itemNumbers' | 'brand' | 'category' | 'highlights';
  /**
   * The number of products to return per page.
   * @default 32
   */
  limit?: number;
  /**
   * Sort order for the products
   * @default 'relevance'
   */
  sort?: 'relevance' | 'priceAsc' | 'priceDesc' | 'nameAsc' | 'nameDesc';
};

export type UseWidgetProductsResult = {
  /**
   * Function to fetch the next page of products.
   */
  fetchNext: () => void;
  /**
   * Whether there are more products to fetch.
   */
  hasNext: boolean;
  /**
   * Whether the products are currently being fetched.
   */
  isFetching: boolean;
  /**
   * Number of products available in the current result set.
   */
  totalResultCount: number;
  /**
   * Array of product results.
   */
  results: Object[];
}

/**
 * The useWidgetProducts hook provides an easy way to retrieve products based on a search term or
 * other criteria.
 */
export declare function useWidgetProducts(
  options: UseWidgetProductsOptions
): UseWidgetProductsResult;
