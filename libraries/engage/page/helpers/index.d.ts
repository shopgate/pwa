export type ProductsWidgetInputConfig = {
  /**
   * A search term to filter products by
   */
  searchTerm: string;
  /**
   * A brand to filter products by
   */
  brand: string;
  /**
   * A category to filter products by
   */
  category: string;
  /**
   * Array of product item numbers (selected via manual input)
   */
  manualItemNumbers: string[];
  /**
   * Array of product item numbers (selected via product selector)
   */
  selectorItemNumbers: string[];
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

type BorderRadiusParams = {
  /**
   * The border radius option
   */
  borderRadius: 'default' | 'none' |'rounded' | 'custom';
  /**
   * The custom border radius value
   */
  customBorderRadius?: number
};

/**
 * Retrieves the border radius based on the widget config
 * @returns The resolved border radius
 */
export declare function resolveBorderRadiusFromWidgetConfig(
  params: BorderRadiusParams
)

/**
 * Validator factory for regular expressions.
 * @param regex The regular expression to match.
 * @returns A function that validates if a value matches the regex.
 */
export declare function matchesRegex(regex: RegExp): (val: string) => boolean;

/**
 * Validates if a given string is a valid HTTPS URL.
 * @param val The string to validate.
 * @returns True if the string is a valid HTTPS URL, false otherwise.
 */
export declare const isHttpsUrl: (val: string) => boolean;
