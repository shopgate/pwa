import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import {
  requestUrl,
  receiveUrl,
  errorUrl,
} from '@shopgate/pwa-common/action-creators/url';
import { mutable } from '@shopgate/pwa-common/helpers/redux';
import { SHOPGATE_CHECKOUT_GET_URL } from '../constants/Pipelines';
import { FETCH_CHECKOUT_URL_TIMEOUT } from '../constants';

const URL_TYPE_CHECKOUT = 'checkout';

/**
 * Get the url for checkout.
 * @return {Function} A redux thunk.
 */
function fetchCheckoutUrl() {
  return (dispatch) => {
    dispatch(requestUrl(URL_TYPE_CHECKOUT));

    return new PipelineRequest(SHOPGATE_CHECKOUT_GET_URL)
      .setTimeout(FETCH_CHECKOUT_URL_TIMEOUT) // 12 seconds timeout
      .setRetries(0)
      .dispatch()
      .then(({ url, expires }) => {
        dispatch(receiveUrl(URL_TYPE_CHECKOUT, url, expires));
        return url;
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorUrl(URL_TYPE_CHECKOUT));
        return error;
      });
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchCheckoutUrl);
