/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Parses the protocol of an url
 * @type {RegExp}
 */
const regexProtocol = /^(.*):\/\//;

/**
 * A list of protocols that can be processed by getProtocolParserOptions
 * @type {Array}
 */
const knownProtocols = ['http', 'https', 'tel', 'mailto'];

/**
 * A list of legacy pages that has to be navigated to with legacy mechanism.
 * @type {Array}
 */
const legacyPages = [
  'terms',
  'return_policy',
  'privacy',
  'register',
  'imprint',
  'shipping',
  'payment',
  'warranty',
];

/**
 * Checks a protocol is one of the known protocols
 * @param {string} protocol The protocol to check
 * @return {boolean}
 */
function isKnownProtocol(protocol) {
  return knownProtocols.indexOf(protocol) !== -1;
}

/**
 * Converts deep links to links that can be processed as internal links
 * @param {string} href The link that shall be converted
 * @return {string} The converted link
 */
function convertDeepLink(href) {
  let converted = href;

  // Get the protocol from the url
  const protocol = regexProtocol.exec(converted);

  if (protocol !== null && !isKnownProtocol(RegExp.$1)) {
    // Remove the "protocol", if the link is a deeplink
    converted = converted.replace(`${RegExp.$1}:/`, '');
  }
  return converted;
}

/**
 * Gets handler options for simple absolute links.
 * @param {string[]} path Url path as an array (['page', 'something'])
 * @param {Object} queryParams Key value mapping for query parameters (?foo=bar)
 * @param {string} url Full url
 */
function getSimpleLinkParserOptions(path, queryParams, url) {
  const mappedPath = [...path];

  /* eslint-disable no-fallthrough */
  // Switch through path
  switch (mappedPath[0]) {
    case 'index':
      mappedPath[0] = '';
    case 'filter':
      this.addLinkAction('reactRouter', {
        url,
        queryParams,
      });
      break;

    case 'page':
      if (legacyPages.includes(mappedPath[1])) {
        // Special pages are handled by the legacy system.
        this.addLinkAction('legacyLink', {
          targetTab: 'main',
          url,
        });
      } else {
        // Custom pages are just routes.
        this.addLinkAction('reactRouter', {
          url: `/${mappedPath.join('/')}`,
          queryParams,
        });
      }
      break;

    case 'account':
    case 'storefinder':
    case 'channel':
      this.addLinkAction('legacyLink', {
        targetTab: 'main',
        url,
      });
      break;

    case 'orders_legacy':
      this.addLinkAction('legacyLink', {
        targetTab: 'main',
        url: '/orders',
      });
      break;

    case 'cart_add_coupon':
      this.addLinkAction('pushNotification', {
        url,
        queryParams,
      });
      break;

    case 'checkout_legacy':
      this.addLinkAction('legacyLink', {
        targetTab: 'cart',
        navigationType: 'checkout',
        url: '/checkout/default',
        backCallback: 'SGAction.popTabToRoot(); SGAction.showTab({ targetTab: "main" });',
      });
      break;
    case 'register_legacy':
      this.addLinkAction('legacyLink', {
        targetTab: 'main',
        url: '/register/default',
      });
      break;

    default:
      this.addLinkAction('reactRouter', {
        url,
        queryParams,
      });
  }
  /* eslint-enable no-fallthrough */
}

/**
 * Links parsed by the ProtocolParser will be passed here to detect what handler should be used
 * @param {string} protocol Protocol of the url.
 * @param {string} url Url of the link.
 */
function getProtocolParserOptions(protocol, url) {
  switch (protocol) {
    // Links that should be opened in the inAppBrowser
    // Links from shopgate domain will be again passed to the simpleLinkParser
    case 'http':
    case 'https':
      this.addLinkAction('externalLink', url);
      return;

    // These links can be handled natively by the browser/webview
    case 'tel':
    case 'mailto':
    default:
      this.addLinkAction('native', url);
  }
}

export default {
  convertDeepLink,
  getSimpleLinkParserOptions,
  getProtocolParserOptions,
};
