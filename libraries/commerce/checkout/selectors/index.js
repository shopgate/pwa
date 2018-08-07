import { getUrl } from '@shopgate/pwa-common/selectors/url';

/**
 * Gets the checkout url.
 * @param {Object} state The application state.
 * @return {string|null}
 */
export const getCheckoutUrl = state => getUrl(state, { type: 'checkout' });
