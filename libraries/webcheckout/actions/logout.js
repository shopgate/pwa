import HttpRequest from '@shopgate/pwa-core/classes/HttpRequest';
import requestShopifyLogout from '../action-creators/requestShopifyLogout';
import errorShopifyLogout from '../action-creators/errorShopifyLogout';
import successShopifyLogout from '../action-creators/successShopifyLogout';
import { getLogoutUrl, getLogoutSuccessUrl } from '../selectors';

/**
 * Log out the current user.
 * @return {Function} A redux thunk.
 */
export default () => (dispatch) => {
  const logoutUrl = getLogoutUrl();

  if (!logoutUrl) {
    // When no logout url is available it doesn't make sense to do the request
    return;
  }

  dispatch(requestShopifyLogout());

  new HttpRequest(logoutUrl)
    .dispatch()
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
