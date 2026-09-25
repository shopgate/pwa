/**
 * Configuration of the "Products" widget input.
 */
export interface ProductsWidgetInputConfig {
  /**
   * A search term to filter products by.
   */
  searchTerm: string;
  /**
   * A brand to filter products by.
   */
  brand: string;
  /**
   * A category to filter products by.
   */
  category: string;
  /**
   * Array of product item numbers (selected via manual input).
   */
  manualItemNumbers: string[];
  /**
   * Array of product item numbers (selected via product selector).
   */
  selectorItemNumbers: string[];
}

/**
 * Return value of {@link getProductSearchParamsFromProductsInputConfig}.
 */
export interface GetProductSearchParamsFromProductsInputConfigReturnValue {
  /**
   * The type of product search to perform.
   */
  productsSearchType: 'searchTerm' | 'brand' | 'category' | 'productIds';
  /**
   * The value to use for the product search. Can be a string or an array of strings
   * (for product IDs).
   */
  productsSearchValue: string | string[];
}

/**
 * Helper to extract relevant search parameters from the widget configuration of the "Products"
 * input.
 * The return value can be used to e.g. parametrize the useWidgetProducts hook.
 * @param products Config object of the "Products" input.
 * @returns The extracted product search parameters.
 */
export const getProductSearchParamsFromProductsInputConfig = (
  products: Partial<ProductsWidgetInputConfig> = {}
): GetProductSearchParamsFromProductsInputConfigReturnValue => {
  const {
    brand,
    category,
    manualItemNumbers,
    selectorItemNumbers,
    searchTerm,
  } = products || {};

  const mapping = [
    ['brand', brand],
    ['category', category],
    ['searchTerm', searchTerm],
    ['productIds', manualItemNumbers],
    ['productIds', selectorItemNumbers],
  ];

  // Pick the first non-undefined value
  const [productsSearchType, productsSearchValue] =
    mapping.find(([, value]) => value !== undefined) || ['searchTerm', searchTerm];

  return {
    productsSearchType,
    productsSearchValue,
  } as GetProductSearchParamsFromProductsInputConfigReturnValue;
};

/**
 * Parses the image URL to return a high resolution version if required.
 * @param url The original image URL.
 * @param useHighRes Whether to return a high resolution version.
 * @returns The parsed image URL.
 */
export const parseImageUrl = (url: string, useHighRes?: boolean): string => {
  if (!url || !useHighRes) {
    return url;
  }

  const match = url.match(/^(.*)\.([^./]+)$/);

  return !match ? url : `${match[1]}@2x.${match[2]}`;
};

/**
 * Parameters for {@link resolveBorderRadiusFromWidgetConfig}.
 */
interface BorderRadiusParams {
  /**
   * The border radius option.
   */
  borderRadius: 'default' | 'none' | 'rounded' | 'custom';
  /**
   * The custom border radius value.
   */
  borderRadiusCustom?: number;
}

/**
 * Retrieves the border radius based on the widget config.
 *
 * `default` follows the app wide corner style, so it is returned as a reference to the theme's
 * shape variable rather than a resolved length.
 * @param params The helper parameters.
 * @param params.borderRadius The border radius option.
 * @param params.borderRadiusCustom The custom border radius value.
 * @returns The resolved border radius as a CSS length.
 */
export const resolveBorderRadiusFromWidgetConfig = (
  { borderRadius, borderRadiusCustom }: BorderRadiusParams
): string => {
  if (borderRadius === 'none') return '0';
  if (borderRadius === 'rounded') return '16px';
  if (borderRadius === 'custom' && typeof borderRadiusCustom === 'number') return `${borderRadiusCustom}px`;
  return 'var(--sg-shape-borderRadius)';
};

/**
 * Validator factory for regular expressions.
 * @param regex The regular expression to match.
 * @returns A function that validates if a value matches the regex.
 */
export const matchesRegex = (regex: RegExp) => (val: string): boolean => !val || regex.test(val);

/**
 * Validates if a given string is a valid HTTPS URL.
 * @param val The string to validate.
 * @returns True if the string is a valid HTTPS URL, false otherwise.
 */
export const isHttpsUrl = matchesRegex(/^\s*https:\/\/[^\s/$.?#].[^\s]*\s*$/i);
