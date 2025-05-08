import { mutable } from '@shopgate/pwa-common/helpers/redux';
import HttpRequest from '@shopgate/pwa-core/classes/HttpRequest';
import requestShopifyLogout from '../action-creators/requestShopifyLogout';
import errorShopifyLogout from '../action-creators/errorShopifyLogout';
import successShopifyLogout from '../action-creators/successShopifyLogout';
import { getLogoutUrl, getLogoutSuccessUrl } from '../selectors';

/**
 * @typedef {Object} LogoutOptions
 * @property {Object.<string, string>} [headers] - Optional request headers.
 */

/**
 * Log out the current user.
 * @param {LogoutOptions} [options] - Optional options containing request headers.
 * @returns {Function} A Redux thunk.
 */
const webCheckoutLogout = (options = {}) => (dispatch) => {
  const logoutUrl = getLogoutUrl();

  if (!logoutUrl) {
    // When no logout url is available it doesn't make sense to do the request
    return;
  }

  dispatch(requestShopifyLogout());

  const request = new HttpRequest(logoutUrl);

  if (options.headers) request.setHeaders(options.headers);

  request.dispatch()
    .then((response) => {
      const {
        headers: { location } = {},
        statusCode,
      } = response;

      const logoutSuccessUrl = getLogoutSuccessUrl();
      // When a success url is available it needs to be considered at the response evaluation
      const urlCheckValid = !logoutSuccessUrl ||
        (location && location.startsWith(logoutSuccessUrl));

      if (statusCode === 302 && urlCheckValid) {
        dispatch(successShopifyLogout());
      } else {
        dispatch(errorShopifyLogout());
      }
    })
    .catch(() => {
      dispatch(errorShopifyLogout());
    });
};

/** @mixes {MutableFunction} */
export default mutable(webCheckoutLogout);
