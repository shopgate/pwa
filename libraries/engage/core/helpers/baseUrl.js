/**
 * Regular expression to decode all possible types of base url from an url
 *
 * URLs of deployed apps
 * https://sandbox.cdn.connect.shopgate.com/shop_30186/@shopgate/theme-ios11/6.22.4/11953/index.html
 *
 * URLs while local development
 * http://192.168.0.1:8080
 */
const baseUrlRegex = /https?:\/\/(?:(?:(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?::[0-9]+)?)|(?:.+index.html))/gm;

/**
 * Decodes the base url from a passed url. When url parameter left empty, window.location.href will
 * be used as source
 * @param {string} [sourceUrl=''] An optional url to be used for decode process
 * @return {string} The decoded base url
 */
export const getAppBaseUrl = (sourceUrl = '') => {
  const [basedUrl = ''] = (sourceUrl || window.location.href).match(baseUrlRegex) || [];
  return basedUrl;
};
