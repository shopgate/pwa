import appConfig from '@shopgate/pwa-common/helpers/config';

/**
 * Turns an entry of the qrCodeAllowedDomains list into a plain domain in the same form as the
 * hostname of a parsed link. A scheme, a "*." prefix, a path and a port are removed.
 * @param {string} entry The list entry.
 * @returns {string} The domain, or an empty string when the entry is no domain with a dot.
 */
const toDomain = (entry) => {
  const value = entry.trim();

  let hostname;
  try {
    ({ hostname } = new URL(value.includes('://') ? value : `https://${value}`));
  } catch (e) {
    return '';
  }

  const domain = hostname.replace(/^\*?\./, '');

  return domain.includes('.') ? domain : '';
};

/**
 * Checks a link from a QR code against the qrCodeAllowedDomains list of the theme config.
 * Subdomains of a listed domain are allowed as well. Only https links without credentials pass.
 * @param {string} link The link from the QR code.
 * @returns {string|null} The normalized link when its host is allowed, otherwise null.
 */
export const getAllowedQrCodeLink = (link) => {
  const { qrCodeAllowedDomains } = appConfig;

  if (!Array.isArray(qrCodeAllowedDomains)) {
    return null;
  }

  let url;
  try {
    url = new URL(link);
  } catch (e) {
    return null;
  }

  const {
    protocol, hostname, username, password,
  } = url;

  if (protocol !== 'https:' || username || password) {
    return null;
  }

  const isAllowed = qrCodeAllowedDomains
    .filter(domain => typeof domain === 'string')
    .map(toDomain)
    .filter(Boolean)
    .some(domain => hostname === domain || hostname.endsWith(`.${domain}`));

  return isAllowed ? url.href : null;
};
