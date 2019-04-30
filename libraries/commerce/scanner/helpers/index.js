import { SCANNER_SCOPE_DEFAULT, SCANNER_TYPE_BARCODE } from '@shopgate/pwa-core/constants/Scanner';
import { getCategoryRoute } from '@shopgate/pwa-common-commerce/category';
import { getProductRoute } from '@shopgate/pwa-common-commerce/product';
import { getSearchRoute } from '@shopgate/pwa-common-commerce/search';
import {
  QR_CODE_TYPE_HOMEPAGE,
  QR_CODE_TYPE_PRODUCT,
  QR_CODE_TYPE_PRODUCT_WITH_COUPON,
  QR_CODE_TYPE_COUPON,
  QR_CODE_TYPE_CATEGORY,
  QR_CODE_TYPE_SEARCH,
  QR_CODE_TYPE_PAGE,
  QR_CODE_HOST_2DS,
  SCANNER_PATH,
} from '../constants';

/**
 * Set of parsers of different types
 */
const typeParsers = {
  [QR_CODE_TYPE_HOMEPAGE]: () => ({ link: '/' }),

  [QR_CODE_TYPE_PRODUCT]: (url) => {
    const [,,, paramTwo] = url.pathname.split('/');
    const decodedParamTwo = decodeURIComponent(decodeURIComponent(paramTwo));

    return {
      link: getProductRoute(decodedParamTwo),
      data: { productId: decodedParamTwo },
    };
  },

  [QR_CODE_TYPE_PRODUCT_WITH_COUPON]: (url) => {
    const [,,, paramTwo, paramThree] = url.pathname.split('/');
    const decodedParamTwo = decodeURIComponent(decodeURIComponent(paramTwo));
    const decodedParamThree = decodeURIComponent(decodeURIComponent(paramThree));

    return {
      link: `/cart_add_product/${encodeURIComponent(decodedParamTwo)}/${encodeURIComponent(decodedParamThree)}`,
      data: {
        productId: decodedParamTwo,
        couponCode: decodedParamThree,
      },
    };
  },

  [QR_CODE_TYPE_COUPON]: (url) => {
    const [,, paramOne] = url.pathname.split('/');
    return {
      link: `/cart_add_coupon/${paramOne}`,
      data: { couponCode: paramOne },
    };
  },

  [QR_CODE_TYPE_CATEGORY]: (url) => {
    const [,,, paramTwo] = url.pathname.split('/');
    const decodedParamTwo = decodeURIComponent(decodeURIComponent(paramTwo));
    return {
      link: getCategoryRoute(decodedParamTwo),
      data: { categoryId: decodedParamTwo },
    };
  },

  [QR_CODE_TYPE_SEARCH]: (url) => {
    const [,,, paramTwo] = url.pathname.split('/');
    const decodedParamTwo = decodeURIComponent(decodeURIComponent(paramTwo));
    return {
      link: getSearchRoute(decodedParamTwo),
      data: { searchPhrase: decodedParamTwo },
    };
  },

  [QR_CODE_TYPE_PAGE]: (url) => {
    const [,,, paramTwo] = url.pathname.split('/');
    const decodedParamTwo = decodeURIComponent(decodeURIComponent(paramTwo));

    return {
      link: `/page/${decodedParamTwo}`,
      data: { pageId: decodedParamTwo },
    };
  },
};

/**
 * Check if links is 2ds.
 * @param {string} code The string from the QR Code
 * @returns {boolean}
 */
export const is2dsQrCode = (code) => {
  try {
    return (new URL(code)).host === QR_CODE_HOST_2DS;
  } catch (e) {
    return false;
  }
};

/**
 * Parses 2ds QR Codes.
 * Generates a deeplink which can be used to open pages.
 * @param {string} code The string from the QR Code.
 * @returns {?{type, link, data}} The parsed type, link, data
 */
export const parse2dsQrCode = (code) => {
  if (!is2dsQrCode(code)) {
    return null;
  }

  const url = new URL(code);
  const [, type] = url.pathname.split('/');

  let link = '/';
  let data = {};

  const typeParser = typeParsers[type];
  if (typeParser) {
    ({ link, data = {} } = typeParser(url));
  }

  return {
    type,
    link,
    data,
  };
};

/**
 * Create a link to the scanner route.
 * @param {string} [scope=SCANNER_SCOPE_DEFAULT] The scanner scope to use for the scanner page
 * @param {string} [type=SCANNER_TYPE_BARCODE] The scanner type to use on the scanner page
 * @returns {string}
 */
export const getScannerRoute = (scope = SCANNER_SCOPE_DEFAULT, type = SCANNER_TYPE_BARCODE) =>
  `${SCANNER_PATH}?scope=${scope}&type=${type}`;
