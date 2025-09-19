export type ProductsWidgetInputConfig = {
  /**
   * Source type for the product list
   */
  productSelectorType: 'searchTerm' | 'brand' | 'category' | 'manualItemNumbers' | 'productSelector';
  /**
   * A search term to filter products by
   */
  productsSearchTerm: string;
  /**
   * A brand to filter products by
   */
  productsBrand: string;
  /**
   * A category to filter products by
   */
  productsCategory: string;
  /**
   * Array of product item numbers (selected via manual input)
   */
  productsManualItemNumbers: string[];
  /**
   * Array of product item numbers (selected via product selector)
   */
  productsSelectorItemNumbers: string[];
}

export type GetProductSearchParamsFromProductsInputConfigReturnValue = {
  /**
   * The type of product search to perform.
   */
  productsSearchType: 'searchTerm' | 'brand' | 'category' | 'productIds';
  /**
   * The value to use for the product search. Can be a string or an array of strings (for product IDs).
   */
  productsSearchValue: string | string[];
}

/**
 * Helper to extract relevant search parameters from the widget configuration of the "Products"
 * input.
 *
 * The return value can be used to e.g. parametrize the useWidgetProducts hook.
 */
export declare function getProductSearchParamsFromProductsInputConfig(
  products: ProductsWidgetInputConfig
): GetProductSearchParamsFromProductsInputConfigReturnValue;

/**
 * Helper to parse the image URL to return a high resolution version if required.
 */
export declare function parseImageUrl(
  url: string,
  useHighRes?: boolean
): string;
