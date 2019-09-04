/**
 * Data modifier for urls
 */

// Contains a list of url parameter names that will be removed from the url
const urlParameterBlacklist = [
  // Tracking parameters that come after switching from http to https
  'SWITCHTOKEN',
  'preview',
  'emos_sid',
  'emos_vid',
  '_ga',
  '__utma',
  '__utmb',
  '__utmc',
  '__utmx',
  '__utmz',
  '__utmv',
  '__utmk',
  // Ga parameter for external payment methods
  'utm_nooverride',
];

/**
 * Returns a path with optional parameters
 * @param {string} pageName Name of the page.
 * @param {string[]} path Path splitted by '/'.
 * @returns {string}
 */
const pathWithParameters = (pageName, path) => {
  if (path.length === 0) {
    return pageName;
  }

  return `${pageName}/${path.join('/')}`;
};

// Mapping function, returns an array.
// The first value will be for shopgate account, second for merchant
const mapping = {
  '': () => 'index',

  favourite_list(path, data) {
    let isEmpty = true;

    if (
      typeof data.favouriteList.products !== 'undefined' && data.favouriteList.products.length
    ) {
      isEmpty = false;
    }
    return isEmpty ? 'favourite_list_empty' : 'favourite_list';
  },
  cart(path, data) {
    const isEmpty = data.cart.productsCount === 0;
    return isEmpty ? 'cart_empty' : 'cart';
  },
  payment_success: (path) => {
    if (path.length >= 2) {
      return `checkout_success/${path[1]}`;
    }

    if (path.length === 1) {
      return `checkout_success/${path[0]}`;
    }

    return 'checkout_success';
  },
  checkout_payment: path => pathWithParameters('checkout_payment_and_shipping', path),
  checkout: () => 'checkout',
  payment_failure: path => pathWithParameters('payment_failure', path),
};

/**
 * Maps an internal url to an external url that we can send to tracking providers
 *
 * @param {string} url internal url
 * @param {Object} [data] sgData object
 *
 * @returns {Object} external url
 */
function sgTrackingUrlMapper(url, data) {
  // In our development system urls start with /php/shopgate/ always
  const developmentPath = '/php/shopgate/';
  const appRegex = /sg_app_resources\/[0-9]*\//;

  // Build regex that will remove all blacklisted parameters
  let regex = '';
  urlParameterBlacklist.forEach((entry) => {
    regex += `((\\?|^){0,1}(${entry}=.*?(&|$)))`;
    regex += '|';
  });
  const params = url.indexOf('?') !== -1 ? url.split('?')[1] : '';
  let urlParams = params.replace(new RegExp(regex, 'g'), '');
  urlParams = urlParams === '' ? '' : `?${urlParams.replace(/&$/, '')}`;

  // Get rid of hash and app urls
  let urlPath = url.split('?')[0].split('#')[0].replace(appRegex, '');

  // Get path from url
  if (url.indexOf(developmentPath) !== -1) {
    urlPath = urlPath.substring(urlPath.indexOf(developmentPath) + developmentPath.length);
  } else if (urlPath.indexOf('http') !== -1) {
    urlPath = urlPath.substring(urlPath.indexOf('/', urlPath.indexOf('//') + 2) + 1);
  } else {
    urlPath = urlPath.substring(1);
  }

  // Get action from path
  const action = urlPath.substring(
    0,
    ((urlPath.indexOf('/') !== -1) ? (urlPath.indexOf('/')) : undefined)
  );

  // If no mapping function is available for the action, continue
  if (typeof mapping[action] === 'undefined') {
    return {
      public: urlPath + urlParams,
      private: action,
    };
  }

  // Call mapping function and return its result
  const pathWithoutAction = urlPath.substring(action.length + 1);
  let pathWithoutActionArray = [];

  if (pathWithoutAction.length !== 0) {
    pathWithoutActionArray = pathWithoutAction.split('/');
  }

  const mappedUrls = mapping[action](pathWithoutActionArray, data || {});

  if (Array.isArray(mappedUrls)) {
    return {
      public: mappedUrls[1] + urlParams,
      private: mappedUrls[0],
    };
  }

  return {
    public: mappedUrls + urlParams,
    private: mappedUrls,
  };
}

export default sgTrackingUrlMapper;
