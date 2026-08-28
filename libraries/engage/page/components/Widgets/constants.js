/**
 * List of allowed origin patterns for cms page preview iFrame communication. Incoming messages are
 * only processed when their origin matches one of these patterns, and outgoing messages are only
 * posted to origins that matched before.
 *
 * A "*" acts as a wildcard for one or more domain labels, so "https://*.shopgate.com" matches
 * "https://app.shopgate.com" as well as "https://next.us.admin.shopgate.com", but neither
 * "https://shopgate.com" nor "https://evil.shopgate.com.attacker.example". Every other character
 * is matched literally, which means that scheme and port always have to match exactly.
 */
export const ALLOWED_PAGE_PREVIEW_ORIGINS = [
  'https://*.shopgate.com',
  'https://*.shopgatedev.com',
  'https://*.shopgatepg.com',
  'http://localhost.localdev.cc',
  'http://localhost:1337',
];

// Whether to consider vertical margins when calculating the overlay position.
export const CONSIDER_CONTAINER_MARGINS_ON_SCROLL_DEFAULT = false;
