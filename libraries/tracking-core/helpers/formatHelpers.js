import { hex2bin, SGLink } from './helper';
import sgTrackingUrlMapper from './urlMapping';
import { customEvents } from '../helpers/events';

/**
 * Gets the value at path of object. If the resolved value is undefined,
 * the defaultValue is used in its place.
 *
 * @param {Object} object The object to query
 * @param {string} path The path of the property to get
 * @param {*} [defaultValue] The value returned for undefined resolved values
 * @returns {*} Returns the resolved value
 */
function get(object, path, defaultValue) {
  // Initialize the parameters
  const data = object || {};
  const dataPath = path || '';
  const defaultReturnValue = defaultValue;

  // Get the segments of the path
  const pathSegments = dataPath.split('.');

  if (!dataPath || !pathSegments.length) {
    // No path or path segments where determinable - return the default value
    return defaultReturnValue;
  }

  /**
   * Recursive callable function to traverse through a complex object
   *
   * @param {Object} currentData The current data that shall be investigated
   * @param {number} currentPathSegmentIndex The current index within the path segment list
   * @returns {*} The value at the end of the path or the default one
   */
  function checkPathSegment(currentData, currentPathSegmentIndex) {
    // Get the current segment within the path
    const currentPathSegment = pathSegments[currentPathSegmentIndex];
    const nextPathSegmentIndex = currentPathSegmentIndex + 1;

    /**
     * Prepare the default value as return value for the case that no matching property was
     * found for the current path segment. In that case the path must be wrong.
     */
    let result = defaultReturnValue;

    if (currentData && currentData.hasOwnProperty(currentPathSegment)) {
      if (
        typeof currentData[currentPathSegment] !== 'object' ||
        pathSegments.length === nextPathSegmentIndex
      ) {
        // A final value was found
        result = currentData[currentPathSegment];
      } else {
        // The value at the current step within the path is another object. Traverse through it
        result = checkPathSegment(currentData[currentPathSegment], nextPathSegmentIndex);
      }
    }

    return result;
  }

  // Start traversing the path within the data object
  return checkPathSegment(data, 0);
}

/**
 * Converts a numeric value into a suitable one for the unified tracking data
 *
 * @param {*} numericValue The value that shall be converted
 * @returns {number|undefined} The converted value
 * @private
 */
function getUnifiedNumber(numericValue) {
  // Convert the value
  const convertedValue = parseFloat(numericValue);

  // Check if the converted value is numeric. If it's not, return "undefined" instead of it
  // eslint-disable-next-line no-restricted-globals
  return !isNaN(convertedValue) ? convertedValue : undefined;
}

/**
 * Converts a value to a string. It returns an empty string for null or undefined.
 * @param {*} value The value.
 * @return {string}
 */
function getStringValue(value) {
  return (value || value === 0) ? `${value}` : '';
}

/**
 * Returns the productNumber or uid from a product
 *
 * @param {Object} product Object with product data
 * @returns {string} productNumber or uid of the product
 * @private
 */
function getProductIdentifier(product) {
  return get(product, 'productNumber') || get(product, 'uid');
}

/**
 * Removes shop names out of the page title
 * @param {string} title The page title
 * @param {string} shopName The shop name
 * @returns {string} The sanitized page title
 */
function sanitizeTitle(title, shopName) {
  // Take care that the parameters don't contain leading or trailing spaces
  let trimmedTitle = title.trim();
  const trimmedShopName = shopName.trim();

  if (!trimmedShopName) {
    /**
     * If no shop name is available, it doesn't make sense to replace it.
     * So we return the the trimmed title directly.
     */
    return trimmedTitle;
  }

  /**
   * Setup the RegExp. It matches leading and trailing occurrences
   * of known patterns for generically added shop names within page title
   */
  const shopNameRegExp = new RegExp(`((^${trimmedShopName}:)|(- ${trimmedShopName}$))+`, 'ig');

  if (trimmedTitle === trimmedShopName) {
    // Clear the page title if it only contains the shop name
    trimmedTitle = '';
  }

  // Remove the shop name from the page title
  return trimmedTitle.replace(shopNameRegExp, '').trim();
}

/**
 * Convert sgData product to unified item
 *
 * @param {Object} product Item from sgData
 * @returns {Object} Data for the unified item
 */
function formatSgDataProduct(product) {
  return {
    id: getStringValue(getProductIdentifier(product)),
    type: 'product',
    name: get(product, 'name'),
    priceNet: getUnifiedNumber(get(product, 'amount.net')),
    priceGross: getUnifiedNumber(get(product, 'amount.gross')),
    quantity: getUnifiedNumber(get(product, 'quantity')),
    currency: get(product, 'amount.currency'),
  };
}

/**
 * Convert sgData products to unified items
 *
 * @param {Array} products Items from sgData
 * @returns {UnifiedPurchaseItem[] | UnifiedAddToCartItem[]} Data for the unified items
 */
function formatSgDataProducts(products) {
  // TODO: Error handling for malformed data

  if (!products || !Array.isArray(products)) {
    return [];
  }
  return products.map(formatSgDataProduct);
}

/**
 * Convert products from the favouriteListItemAdded event to unified items
 *
 * @param {Array} products Items from sgData
 * @returns {UnifiedAddToWishlistItem[]} Data for the unified items
 */
function formatFavouriteListItems(products) {
  if (!products || !Array.isArray(products)) {
    return [];
  }

  return products.map(product => ({
    id: getStringValue(get(product, 'product_number_public') ||
      get(product, 'product_number') ||
      get(product, 'uid')),
    type: 'product',
    name: get(product, 'name'),
    priceNet: getUnifiedNumber(get(product, 'unit_amount_net')) / 100,
    priceGross: getUnifiedNumber(get(product, 'unit_amount_with_tax')) / 100,
    currency: get(product, 'currency_id'),
  }));
}

/**
 * Storage for helper functions that transforms raw data
 * into the unified format for the tracking plugins
 */
const dataFormatHelpers = {};

/**
 * Converter for the custom events
 *
 * @param {Object} data Raw data from the core
 * @returns {UnifiedCustomEvent} Data for the unified custom event
 * @private
 */
const formatEventData = data => ({
  eventCategory: '',
  eventAction: '',
  eventLabel: null,
  eventValue: null,
  nonInteraction: false,
  ...data,
});

// Assign the format helper to all custom events
customEvents.forEach((event) => {
  dataFormatHelpers[event] = formatEventData;
});

/**
 * Converter for the purchase event
 *
 * @param {Object} rawData Raw data from the core
 * @returns {UnifiedPurchase} Data for the unified purchase event
 */
dataFormatHelpers.purchase = rawData => ({
  id: getStringValue(get(rawData, 'order.number')),
  type: 'product',
  affiliation: get(rawData, 'shop.name', ''),
  revenueGross: getUnifiedNumber(get(rawData, 'order.amount.gross')),
  revenueNet: getUnifiedNumber(get(rawData, 'order.amount.net')),
  tax: getUnifiedNumber(get(rawData, 'order.amount.tax')),
  shippingGross: getUnifiedNumber(get(rawData, 'order.shipping.amount.gross')),
  shippingNet: getUnifiedNumber(get(rawData, 'order.shipping.amount.net')),
  currency: get(rawData, 'order.amount.currency'),
  items: formatSgDataProducts(get(rawData, 'order.products')),
});

/**
 * Converter for the pageview event
 *
 * @param {Object} rawData Raw data from the core
 * @returns {{page: {merchantUrl: string, shopgateUrl: string}}} Formatted data
 */
dataFormatHelpers.pageview = (rawData) => {
  const mappedUrls = sgTrackingUrlMapper(get(rawData, 'page.link'), rawData);
  return {
    page: {
      merchantUrl: mappedUrls.public,
      shopgateUrl: mappedUrls.private,
    },
  };
};

/**
 * Converter for the viewContent event
 *
 * @param {Object} rawData Raw data from the core
 * @returns {UnifiedPageview} Data for the unified page view event
 */
dataFormatHelpers.viewContent = (rawData) => {
  let link = get(rawData, 'page.link');

  if (link.indexOf('sg_app_resources') !== -1) {
    /**
     * Check if the link is formatted in the app style
     * and reformat it do make it parsable with SGLink
     * Note: this will be removed when CON-410 is done
     */
    link = `http://dummy.com${link.replace(/(.*sg_app_resources\/\d*)/i, '')}`;
  }

  link = new SGLink(link);

  /**
   * In splittedPath we have the action as the first array entry
   * to get the id/action params we remove the action from the array
   */
  const splittedPath = [...link.splittedPath];
  splittedPath.shift();

  /**
   * All pages have action as type and a parsed page title without shop name as name
   * fb content ID = 'id / name'
   */
  let id = splittedPath.join('/');
  let type = link.action || 'index';
  let name = sanitizeTitle(get(rawData, 'page.title', ''), get(rawData, 'shop.name', '')) ||
    get(rawData, 'page.name');

  /**
   * Category, product and product related pages should have productnumber/categorynumber as id
   * they should have product name / category name as name
   */
  if (rawData.hasOwnProperty('product') && type === 'item') {
    type = 'product';
    id = getProductIdentifier(rawData.product);
  } else if (rawData.hasOwnProperty('category') && type === 'category') {
    id = get(rawData, 'category.uid');
    if (splittedPath.indexOf('all') !== -1) {
      id += '/all';
    }
  } else if (rawData.hasOwnProperty('search') && type === 'search') {
    id = get(rawData, 'search.query');
    name = name.substring(0, name.indexOf(':')).trim();
  } else if (['product_info', 'reviews', 'add_review'].indexOf(type) !== -1) {
    id = hex2bin(link.splittedPath[1]) || '';
  } else if (type === 'payment_success') {
    type = 'checkout_success';
  }

  return {
    id,
    type,
    name,
  };
};

/**
 * Converter for the addToCart event
 *
 * @param {Object} rawData Raw data from the core
 * @returns {UnifiedAddToCart} data for the addToCart event
 */
dataFormatHelpers.addToCart = rawData => ({
  type: 'product',
  items: formatSgDataProducts(get(rawData, 'products')),
});

/**
 * Converter for the variantSelected event
 *
 * @param {Object} rawData {variant:{}, baseProduct:{}} Raw data from the core
 * @returns {Object} data for the addToCart event
 */
dataFormatHelpers.variantSelected = rawData => ({
  variant: formatSgDataProduct(rawData.variant),
  baseProduct: formatSgDataProduct(rawData.baseProduct),
});

/**
 * Converter for the addToWishlist event
 *
 * @param {Object} rawData Raw data from the core
 * @returns {UnifiedAddToWishlist} data for the addToWishlist event
 */
dataFormatHelpers.addToWishlist = rawData => ({
  type: 'product',
  items: formatFavouriteListItems(get(rawData, 'favouriteListProducts')),
});

/**
 * Converter for the initiatedCheckout event
 *
 * @param {Object} rawData Raw data from the core
 * @returns {UnifiedInitiatedCheckout} data for the addToCart event
 */
dataFormatHelpers.initiatedCheckout = (rawData) => {
  const checkoutType = get(rawData, 'checkoutType', 'default');
  // Get amount, depending if pp express on cart or item page was clicked
  const amount = get(rawData, 'product.amount') || get(rawData, 'cart.amount');

  return {
    type: checkoutType,
    valueNet: getUnifiedNumber(get(amount, 'net')),
    valueGross: getUnifiedNumber(get(amount, 'gross')),
    // PP express on item page sends the quantity directly
    numItems: getUnifiedNumber(get(rawData, 'quantity') || get(rawData, 'cart.productsCount')),
    currency: get(amount, 'currency'),
    paymentInfoAvailable: checkoutType !== 'default',
  };
};

/**
 * Converter for the completedRegistration event
 * @param {Object} rawData rawData Raw data from the core
 * @returns {UnifiedCompletedRegistration} Information about the registration type
 */
dataFormatHelpers.completedRegistration = rawData => ({
  registrationMethod: get(rawData, 'registrationType'),
});

/**
 * Converter for the search event
 *
 * @param {Object} rawData Raw data from the core
 * @returns {UnifiedSearched} data for the search event
 */
dataFormatHelpers.search = (rawData) => {
  const hits = get(rawData, 'search.resultCount');

  return {
    type: 'product',
    query: get(rawData, 'search.query'),
    hits: getUnifiedNumber(hits),
    success: !!hits,
  };
};

/**
 * Return the url from the rawData
 *
 * @param {Object} rawData Raw data from the core
 * @returns {Object} data for the setCampaignWithUrl event
 */
dataFormatHelpers.setCampaignWithUrl = rawData => ({
  url: rawData.url,
});

/**
 * Converter for the addedPaymentInfo event
 *
 * @param {Object} rawData Raw data from the core
 * @returns {UnifiedAddedPaymentInfo} Data for the AddedPaymentInfo event
 */
dataFormatHelpers.addedPaymentInfo = rawData => ({
  success: get(rawData, 'paymentMethodAdded.success'),
  name: get(rawData, 'paymentMethodAdded.name'),
});

export default dataFormatHelpers;
