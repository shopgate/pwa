import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import {
  requestUrl,
  receiveUrl,
  errorUrl,
} from '@shopgate/pwa-common/action-creators/url';
import { mutable } from '@shopgate/pwa-common/helpers/redux';
import * as pipelines from '../constants/Pipelines';
import { FETCH_CHECKOUT_URL_TIMEOUT } from '../constants';

const URL_TYPE_CHECKOUT = 'checkout';

/**
 * Get the url for checkout.
 * @return {Function} A redux thunk.
 */
const fetchCheckoutUrl = () => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(requestUrl(URL_TYPE_CHECKOUT));

    new PipelineRequest(pipelines.SHOPGATE_CHECKOUT_GET_URL)
      .setTimeout(FETCH_CHECKOUT_URL_TIMEOUT) // 12 seconds timeout
      .setRetries(0)
      .dispatch()
      .then(({ url, expires }) => {
        dispatch(receiveUrl(URL_TYPE_CHECKOUT, url, expires));
        resolve(url);
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorUrl(URL_TYPE_CHECKOUT));
        reject();
      });
  });

/** @mixes {MutableFunction} */
export default mutable(fetchCheckoutUrl);
