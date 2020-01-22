import DataRequest from '@shopgate/pwa-core/classes/DataRequest';
import { logger } from '@shopgate/pwa-core/helpers';

export * as SGAction from '@shopgate/pwa-core/commands/unifiedTracking';

/**
 * Decodes a hexadecimal encoded binary string
 * @param {string} str The string that shall be decoded
 * @see http://locutus.io/php/strings/hex2bin/
 * @returns {string|boolean} Hexadecimal representation of data. FALSE if decoding failed.
 */
export const hex2bin = (str) => {
  const s = `${str}`;

  const ret = [];
  let i = 0;
  let l;

  for (l = s.length; i < l; i += 2) {
    const c = parseInt(s.substr(i, 1), 16);
    const k = parseInt(s.substr(i + 1, 1), 16);

    // eslint-disable-next-line no-restricted-globals
    if (isNaN(c) || isNaN(k)) {
      return false;
    }

    // eslint-disable-next-line no-bitwise
    ret.push((c << 4) | k);
  }

  // eslint-disable-next-line prefer-spread
  return String.fromCharCode.apply(String, ret);
};

/**
 * Sends a DataRequest
 * @param {string} url Url for the request
 */
export function sendDataRequest(url) {
  new DataRequest(url)
    .dispatch()
    .then(result => logger.info(url, result))
    .catch(err => err && logger.error(err));
}

/**
 * Object representation of URI(RFC2396) string
 * Made for general purpose. Feel free to extend it for your needs.
 */
export class SGLink {
  // Complete url string
  url = '';

  // Any scheme we support (ex. https|shopgate-{$number}|sgapi)
  scheme = '';

  authority = '';

  path = '';

  splittedPath = [];

  query = '';

  // Endpoint - safe for shopgate (ex. no endpoint is converted to "index")
  action = '';

  params = {};

  isDeepLink = false;

  /**
   * Constructor
   * @param {string} url Url to creating SGLink from
   */
  constructor(url) {
    this.url = url;
    this.parseUrl(url);
  }

  /**
   * Encode the url with encodeURIComponent and
   * takes care of double encoding
   *
   * @param {string} string - string to be encoded
   * @return {string}
   */
  static encodeURIComponentSafe(string) {
    const decoded = decodeURIComponent(string);

    if (decoded !== string) {
      return string;
    }

    return encodeURIComponent(string);
  }

  /**
   * Encode the url and takes care of double encoding
   * @param {string} string String to be encoded
   * @returns {string} encoded string
   */
  static encodeURISafe(string) {
    const decoded = decodeURI(string);

    if (decoded !== string) {
      return string;
    }

    return encodeURI(string);
  }

  /**
   * Parses url and extracts path, query, action, splittedPath, ...
   *
   * @param {string} incomingUrl The url that shall be parsed.
   */
  parseUrl(incomingUrl) {
    let urlToSanitize = incomingUrl;
    if (!urlToSanitize) {
      urlToSanitize = '';
    }

    const commonSchemas = [
      'http', 'https', 'tel', 'mailto',
    ];

    // Based on the regex in RFC2396 Appendix B.
    const parser = /^(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/;
    const result = urlToSanitize.match(parser);

    if (!this.isDeepLink && result[1] && commonSchemas.indexOf(result[1]) === -1) {
      this.isDeepLink = true;
      const scheme = `${result[1]}://`;

      /**
       * Add slash so that we can parse the attributes properly
       * (for shopgate-standalone://cart we would get e.g. "authority: cart" which is wrong)
       */
      urlToSanitize = urlToSanitize.replace(scheme, `${scheme}/`);

      this.parseUrl(urlToSanitize);
      return;
    }

    this.scheme = result[1] || '';
    this.authority = result[2] || '';
    this.path = result[3] || '';
    this.query = result[4] || '';
    this.action = ''; // Endpoint - safe for shopgate (ex. no endpoint is converted to "index")

    if (this.query) {
      const queryParts = this.query.split('&');
      const queryPartsLength = queryParts.length;

      // Clearing params
      this.setParams({});
      for (let i = 0; i < queryPartsLength; i += 1) {
        const queryPair = queryParts[i].split('=');
        this.setParam(queryPair[0], queryPair[1]);
      }
    }

    if (this.path) {
      const pathSplitted = this.path.replace('/php/shopgate', '').split('/');
      this.action = pathSplitted[0] || '';
      this.splittedPath = pathSplitted;

      if (pathSplitted[0] === '/' || pathSplitted[0] === '') {
        this.action = pathSplitted[1] || '';
        this.splittedPath.shift();
      }
    }
  }

  /**
   * Gets a param
   * @param {string} name name of param
   * @return {string|undefined}
   */
  getParam(name) {
    if (!(name in this.params)) {
      return undefined;
    }

    return this.params[name];
  }

  /**
   * Sets param.
   * @param {string} name Name of param
   * @param {string} [value] Value of param - if empty, the parameter will be deleted from the query
   */
  setParam(name, value) {
    if (typeof value === 'undefined') {
      this.deleteParam(name);
    } else {
      this.params[name] = value;
      this.setParams();
    }
  }

  /**
   * Sets params array
   *
   * @param {Object} [newParams] New Params to be set
   */
  setParams(newParams) {
    const newQueryArr = [];

    if (typeof newParams !== 'undefined') {
      this.params = newParams;
    }

    Object.keys(this.params).forEach((keyName) => {
      newQueryArr.push(`${keyName}=${SGLink.encodeURIComponentSafe(this.params[keyName])}`);
    });

    this.query = newQueryArr.join('&');
  }

  /**
   * Safely deletes the param.
   *
   * @param {string} name name of param
   * @returns {boolean}
   */
  deleteParam(name) {
    if (!(name in this.params)) {
      return false;
    }

    delete this.params[name];
    this.setParams(this.params);

    return true;
  }

  /**
   * Converts the object to string
   *
   * @return {string}
   */
  toString() {
    let outputUrl = '';
    const notNavigatorSchema = ['mailto', 'tel'].indexOf(this.scheme) > -1;

    if (this.scheme) {
      outputUrl += this.scheme;

      // The sgapi-links don't need further scheme parsing since the scheme is 'sgapi:'
      if (this.scheme !== 'sgapi') {
        if (notNavigatorSchema) {
          if (this.scheme.indexOf(':') === -1) {
            outputUrl += ':';
          }
        } else {
          if (this.scheme.indexOf(':/') === -1) {
            // If the scheme already contains :/ we don't want to add it again
            outputUrl += ':/';
            this.scheme = outputUrl;
          }
          if (!this.isDeepLink) {
            outputUrl += '/';
          }
        }
      } else if (this.scheme.indexOf(':') === -1) {
        outputUrl += ':';
      }
    }

    if (this.authority) {
      outputUrl += this.authority;
    }

    outputUrl += this.toRelativeString(false);

    return outputUrl;
  }

  /**
   * Converts the object to relative url
   * @param {boolean} [leadingSlash=true] Tells if the url shall start with a leading slash
   * @return {string}
   */
  toRelativeString = (leadingSlash = true) => {
    let outputUrl = '';
    if (leadingSlash && this.path[0] !== '/') {
      outputUrl = '/';
    }
    if (this.path) {
      outputUrl += SGLink.encodeURISafe(this.path);
    }
    if (this.query) {
      // .query is always encoded
      outputUrl += `?${this.query}`;
    }

    return outputUrl;
  }

  /**
   * Sets utm param from event.
   * @param {Object} data event data
   * @param {Object} raw event raw data
   */
  setUtmParams(data, raw) {
    // Add fake params, only if it didn't come from branch.io
    if (raw.type !== 'branchio') {
      this.setParam('utm_source', 'shopgate');
      this.setParam('utm_medium', raw.type);
    }

    if (raw.type === 'push_message') {
      const campaigns = ['cart_reminder', 'inactive_app_user'];
      const notificationId = raw.notificationId || 'not-provided';
      const campaignName = this.getParam('utm_campaign');

      if (campaigns.indexOf(campaignName) !== -1) {
        // Set utm_content to distinguish the cart reminders from "normal" push messages
        this.setParam('utm_content', campaignName);
      }

      this.setParam('utm_campaign', `push-${notificationId}`);
    }
  }
}
