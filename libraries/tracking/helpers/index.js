import get from 'lodash/get';
import find from 'lodash/find';
import { logger } from '@shopgate/pwa-core/helpers';
import {
  QR_CODE_TYPE_HOMEPAGE,
  QR_CODE_TYPE_PRODUCT,
  QR_CODE_TYPE_PRODUCT_WITH_COUPON,
  QR_CODE_TYPE_COUPON,
  QR_CODE_TYPE_CATEGORY,
  QR_CODE_TYPE_SEARCH,
  QR_CODE_TYPE_PAGE,
  SCANNER_FORMATS_BARCODE,
  SCANNER_FORMATS_QR_CODE,
} from '@shopgate/pwa-common-commerce/scanner/constants';
import { parse2dsQrCode } from '@shopgate/pwa-common-commerce/scanner/helpers';
import core from '@shopgate/tracking-core/core/Core';
import { shopNumber } from '@shopgate/pwa-common/helpers/config';
import { i18n } from '@shopgate/engage/core';

/**
 * Converts a price to a formatted string.
 * @param {number} price The original price.
 * @return {string|*} The converted price or the original value, if the price was not convertible.
 */
export const convertPriceToString = (price) => {
  if (typeof price === 'number') {
    return price.toFixed(2);
  }

  return price;
};

/**
 * Re-format a given product from the store.
 * @param {Object} productData The product data from the store
 * @returns {Object|null} The formatted product.
 */
export const formatProductData = (productData) => {
  if (!productData) {
    return null;
  }

  const {
    id,
    name,
    price,
    manufacturer,
    tags = [],
  } = productData;

  return {
    name,
    manufacturer,
    tags,
    uid: id,
    amount: {
      net: convertPriceToString(price.unitPriceNet),
      gross: convertPriceToString(price.unitPriceWithTax),
      striked: convertPriceToString(price.unitPriceStriked),
      currency: price.currency,
    },
  };
};

/**
 * Reformat product data for addToCart from the store to the format our core expects.
 * @param {Object} product Product from the store
 * @param {Object} quantity Quantity of the product
 * @return {Object}
 */
export const formatAddToCartProductData = ({ product, quantity }) => ({
  ...formatProductData(product),
  quantity,
});

/**
 * Reformat product data from the store to the format our core expects.
 * @param {Object} product Product from the store
 * @param {Object} quantity Quantity of the product
 * @return {Object}
 */
export const formatCartProductData = ({ product, quantity }) => ({
  uid: product.id,
  name: product.name,
  amount: {
    gross: convertPriceToString(product.price.unit),
  },
  quantity,
});

/**
 * Reformat order data from web checkout to the format our core expects.
 * @param {Object} passedOrder Information about the order.
 * @return {Object}
 */
export const formatPurchaseData = (passedOrder) => {
  // Return the passedOrder if the format is already correct
  if (!passedOrder.totals && passedOrder.amount) {
    return {
      order: passedOrder,
    };
  }

  const defaults = {
    totals: [],
    products: [],
    number: '',
    currency: '',
  };

  const order = {
    ...defaults,
    ...passedOrder,
  };

  const { amount: grandTotal = 0 } = find(order.totals, { type: 'grandTotal' }) || {};
  const { amount: shipping = 0 } = find(order.totals, { type: 'shipping' }) || {};
  const { amount: tax = 0 } = find(order.totals, { type: 'tax' }) || {};
  const grandTotalNet = grandTotal - tax;

  const products = order.products.map(product => ({
    uid: product.id || '',
    productNumber: product.id || '',
    name: product.name || '',
    quantity: product.quantity || 1,
    amount: {
      currency: order.currency,
      gross: convertPriceToString(get(product, 'price.withTax', 0)),
      net: convertPriceToString(get(product, 'price.net', 0)),
    },
  }));

  return {
    shop: {
      name: '',
    },
    order: {
      number: order.number,
      amount: {
        currency: order.currency,
        gross: convertPriceToString(grandTotal),
        net: convertPriceToString(grandTotalNet),
        tax: convertPriceToString(tax),
      },
      shipping: {
        amount: {
          gross: convertPriceToString(shipping),
          net: convertPriceToString(shipping),
        },
      },
      products,
      shippingAddress: {
        city: '',
        country: '',
      },
    },
  };
};

/**
 * Creates data for the scanner tracking events.
 * @param {Object} params params
 * @return {Object}
 */
export const createScannerEventData = ({
  event, format, payload, userInteraction,
}) => {
  let eventLabel = [];

  if (payload) {
    eventLabel = [format];

    if (SCANNER_FORMATS_QR_CODE.includes(format)) {
      const parsedPayload = parse2dsQrCode(payload);

      if (parsedPayload) {
        const { type, data } = parsedPayload;

        switch (type) {
          case QR_CODE_TYPE_HOMEPAGE:
            eventLabel.push('main');
            break;
          case QR_CODE_TYPE_PRODUCT:
            eventLabel.push('product');
            eventLabel.push(data.productId);
            break;
          case QR_CODE_TYPE_PRODUCT_WITH_COUPON:
            eventLabel.push('productcoupon');
            eventLabel.push(`${data.productId}_${data.couponCode}`);
            break;
          case QR_CODE_TYPE_COUPON:
            eventLabel.push('coupon');
            eventLabel.push(data.couponCode);
            break;
          case QR_CODE_TYPE_CATEGORY:
            eventLabel.push('category');
            eventLabel.push(data.categoryId);
            break;
          case QR_CODE_TYPE_SEARCH:
            eventLabel.push('search');
            eventLabel.push(data.searchPhrase);
            break;
          case QR_CODE_TYPE_PAGE:
            eventLabel.push('page');
            eventLabel.push(data.pageId);
            break;
          default:
            break;
        }
      }
    } else if (SCANNER_FORMATS_BARCODE.includes(format)) {
      if (payload) {
        eventLabel.push(payload);
      }
    }
  }

  eventLabel = eventLabel.join(' - ');

  return {
    eventAction: event,
    ...eventLabel && { eventLabel },
    ...(typeof userInteraction === 'boolean') && { userInteraction },
  };
};

/**
 * Creates data for the scanner utm url.
 * @param {Object} params params
 * @return {Object}
 */
export const buildScannerUtmUrl = ({
  scannerRoute, format, payload, referer,
}) => {
  const source = 'shopgate';
  let medium = 'scanner';
  let campaign = `${shopNumber}Scanner`;
  let term = '';

  if (SCANNER_FORMATS_BARCODE.includes(format)) {
    medium = 'barcode_scanner';
    campaign = `${shopNumber}BarcodeScan`;
    term = payload;
  } else if (SCANNER_FORMATS_QR_CODE.includes(format)) {
    medium = 'qrcode_scanner';
    campaign = `${shopNumber}QRScan`;

    const { type, data } = parse2dsQrCode(payload);
    if (type === QR_CODE_TYPE_SEARCH) {
      term = data.searchPhrase;
    }
  }

  const { location } = scannerRoute;

  const newPath = new URL(location, 'http://scanner.com');

  const utms = {
    utm_source: source,
    utm_medium: medium,
    utm_campaign: campaign,
    utm_term: term,
    utm_content: referer,
  };

  Object.keys(utms).forEach((utm) => {
    if (!newPath.searchParams.has(utm) && utms[utm]) {
      newPath.searchParams.set(utm, utms[utm]);
    }
  });

  return `${newPath.pathname}${newPath.search}`;
};

/**
 * Creates tracking data for a category.
 * @param {Object} category The category data from the store.
 * @returns {Object|null}
 */
export const createCategoryData = (category) => {
  if (!category) {
    return null;
  }

  const { name, id: uid, path } = category;

  return {
    uid,
    name,
    path,
  };
};

/**
 * Creates tracking data for the root category.
 * @param {Object} rootCategory The category data from the store.
 * @return {Object|null}
 */
export const createRootCategoryData = (rootCategory) => {
  if (!rootCategory) {
    return null;
  }

  return {
    uid: null,
    name: i18n.text('titles.categories'),
    path: null,
  };
};

/**
 * Creates tracking data for the page view event.
 * @param {Object} data The input data.
 * @return {Object}
 */
export const createPageviewData = ({
  page = null,
  cart = null,
  search = null,
  category = null,
  product = null,
  pageConfig,
}) => {
  let title = '';

  if (pageConfig) {
    ({ title } = pageConfig);
  } else if (category && category.name) {
    title = category.name;
  } else if (product && product.name) {
    title = product.name;
  }

  return {
    page: page ? {
      ...page,
      title,
    } : null,
    cart,
    search,
    category,
    product,
  };
};
/**
 * Helper to pass the redux state to the tracking core
 * @param {string} eventName The name of the event.
 * @param {Object} data The tracking data of the event.
 * @param {Object} state The current redux state.
 * @return {Core|boolean}
 */
export const track = (eventName, data, state) => {
  if (typeof core.track[eventName] !== 'function') {
    logger.warn('Unknown tracking event:', eventName);
    return false;
  }

  try {
    core.track[eventName](data, undefined, undefined, state);
  } catch (e) {
    logger.error(e);
  }

  return core;
};
