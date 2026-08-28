/**
 * Internal to the admin-preview package - do not import this module from anywhere else. Consume
 * the isAllowedOrigin / getReferrerOrigin helpers from @shopgate/engage/admin-preview/helpers
 * instead.
 */

/**
 * Regular expression source that a "*" within an allowed origin pattern is replaced with. It
 * matches one or more domain labels, but never a dot at the very end, so that the suffix of the
 * pattern stays anchored to the end of the origin.
 */
const ORIGIN_WILDCARD_SOURCE = '(?:[a-zA-Z0-9-]+\\.)*[a-zA-Z0-9-]+';

// Cache for regular expressions that were already created from an origin pattern.
const originPatternCache = new Map<string, RegExp>();

/**
 * Converts an allowed origin pattern into an anchored regular expression. Every character except
 * the "*" wildcard is matched literally.
 * @param pattern The origin pattern e.g. "https://*.shopgate.com".
 * @returns The regular expression for the pattern.
 */
const createOriginRegExp = (pattern: string): RegExp => {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return new RegExp(`^${escaped.split('\\*').join(ORIGIN_WILDCARD_SOURCE)}$`);
};

/**
 * Checks if an origin is covered by a list of allowed origin patterns.
 * @param origin The origin to check e.g. "https://app.shopgate.com".
 * @param patterns The allowed origin patterns.
 * @returns Whether the origin is allowed.
 */
export const matchesAllowedOrigin = (
  origin: string | null | undefined,
  patterns: string[] = []
): boolean => {
  // Opaque origins are serialized as "null" and must never be trusted.
  if (typeof origin !== 'string' || origin === '' || origin === 'null') {
    return false;
  }

  return patterns.some((pattern) => {
    if (typeof pattern !== 'string' || pattern === '') {
      return false;
    }

    if (!pattern.includes('*')) {
      return pattern === origin;
    }

    if (!originPatternCache.has(pattern)) {
      originPatternCache.set(pattern, createOriginRegExp(pattern));
    }

    return originPatternCache.get(pattern).test(origin);
  });
};

/**
 * Determines the origin of the document that embeds the current page. Since allowed origins can be
 * patterns, and patterns are no valid postMessage targets, this is the only way to address a parent
 * that has not sent a message yet.
 * @returns The referrer origin, or null when it can't be determined.
 */
export const readReferrerOrigin = (): string | null => {
  try {
    return new URL(document.referrer).origin;
  } catch (e) {
    return null;
  }
};
