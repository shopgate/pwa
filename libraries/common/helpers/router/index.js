import { createBrowserHistory } from 'history';
import { router } from '@virtuous/conductor';
import { logger } from '@shopgate/pwa-core/helpers';

const match = /^(.*)index.html/.exec(window.location.pathname);

const { getCurrentRoute } = router;
/**
 * @deprecated
 */
export { getCurrentRoute, router };

/**
 * Creates the router history.
 * @returns {Object}
 */
export const history = () => createBrowserHistory({
  basename: match ? match[0] : '',
});

/**
 * Transforms a given URL query string to an object.
 * @param {string} queryString An URL query string.
 * @returns {Object}
 */
export const parseQueryStringToObject = (queryString = null) => {
  if (!queryString) {
    return {};
  }

  const urlParams = new URLSearchParams(queryString);
  const keys = Array.from(urlParams.keys());

  return keys.reduce((obj, key) => ({
    ...obj,
    [key]: urlParams.get(key),
  }), {});
};

/**
 * Transforms a given object to an URL query string.
 * @param {Object} obj An object with keys/values.
 * @param {boolean} [includePrefix=true] If true a `?` is prefixed.
 * @returns {string}
 */
export const parseObjectToQueryString = (obj, includePrefix = true) => {
  if (!obj) {
    return '';
  }

  const urlParams = new URLSearchParams();
  const keys = Object.keys(obj);

  if (keys.length === 0) {
    return '';
  }

  keys.forEach(key => urlParams.set(key, obj[key]));

  if (includePrefix) {
    return `?${urlParams.toString()}`;
  }

  return urlParams.toString();
};

// Angle brackets and their HTML entity representations.
const ANGLE_BRACKET_ENTITIES = '&(lt|gt|#0*6[02]|#x0*3[ce]);?';
const UNSAFE_CHARS_REGEX = new RegExp(`[<>]|${ANGLE_BRACKET_ENTITIES}`, 'i');
const UNSAFE_PROTOCOL_REGEX = /^\s*(javascript|data|vbscript):/i;

/**
 * Removes HTML tags, angle brackets and their entity representations from a string.
 * @param {string} value The (decoded) value.
 * @returns {string}
 */
const stripHtml = value => value
  .replace(new RegExp(ANGLE_BRACKET_ENTITIES, 'gi'), '')
  .replace(/<[^>]*>/g, '')
  .replace(/[<>]/g, '');

/**
 * Removes HTML from a single URI component. The component is only modified when it contains
 * suspicious characters, so regular components (e.g. encoded product ids) stay untouched.
 * @param {string} component A single URI encoded component like a path segment.
 * @returns {string}
 */
const sanitizeUriComponent = (component) => {
  let decoded;

  try {
    decoded = decodeURIComponent(component);
  } catch (e) {
    // Malformed encoding - fall back to the raw component.
    decoded = component;
  }

  if (!UNSAFE_CHARS_REGEX.test(decoded)) {
    return component;
  }

  return encodeURIComponent(stripHtml(decoded));
};

/**
 * Removes HTML from a decoded query parameter key or value.
 * @param {string} value The decoded value.
 * @returns {string}
 */
const sanitizeQueryValue = value => (UNSAFE_CHARS_REGEX.test(value) ? stripHtml(value) : value);

/**
 * Sanitizes a link which was received from an external source (e.g. deep links or push messages)
 * before it's passed to the router. HTML markup is removed from the path, query and hash to prevent
 * that it's rendered somewhere within the app. Links with a script protocol are rejected.
 * Links without suspicious content are returned unchanged.
 * @param {string} link The link to sanitize.
 * @returns {string} The sanitized link or an empty string when the link was rejected.
 */
export const sanitizeLink = (link) => {
  if (typeof link !== 'string' || link === '') {
    return '';
  }

  if (UNSAFE_PROTOCOL_REGEX.test(link)) {
    logger.warn('sanitizeLink: Rejected link with unsafe protocol', link);
    return '';
  }

  const hashIndex = link.indexOf('#');
  const beforeHash = hashIndex === -1 ? link : link.slice(0, hashIndex);
  const hash = hashIndex === -1 ? null : link.slice(hashIndex + 1);

  const queryIndex = beforeHash.indexOf('?');
  const base = queryIndex === -1 ? beforeHash : beforeHash.slice(0, queryIndex);
  const query = queryIndex === -1 ? null : beforeHash.slice(queryIndex + 1);

  let sanitized = base
    .split('/')
    .map(sanitizeUriComponent)
    .join('/');

  if (query !== null) {
    const params = new URLSearchParams(query);
    const sanitizedParams = new URLSearchParams();
    let modified = false;

    params.forEach((value, key) => {
      const sanitizedKey = sanitizeQueryValue(key);
      const sanitizedValue = sanitizeQueryValue(value);
      modified = modified || sanitizedKey !== key || sanitizedValue !== value;
      sanitizedParams.append(sanitizedKey, sanitizedValue);
    });

    sanitized += `?${modified ? sanitizedParams.toString() : query}`;
  }

  if (hash !== null) {
    sanitized += `#${sanitizeUriComponent(hash)}`;
  }

  if (sanitized !== link) {
    logger.warn('sanitizeLink: Removed unsafe content from link', link);
  }

  return sanitized;
};
