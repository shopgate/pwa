import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { variantDidChange$ } from '@shopgate/pwa-common-commerce/product/streams';
import { productIsReady$ } from '../streams/product';
import { getBaseProductFormatted, getProductFormatted } from '../selectors/product';
import { makeGetTrackingData } from '../selectors';
import { track } from '../helpers';

/**
 * Product tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function product(subscribe) {
  /**
   * Gets triggered on product variant change/selection.
   */
  subscribe(variantDidChange$, ({ getState, action }) => {
    const state = getState();
    const { id: productId } = action.productData;
    const props = { productId };

    const trackingData = {
      variant: getProductFormatted(state, props),
      baseProduct: getBaseProductFormatted(state, props),
    };

    track('variantSelected', trackingData, state);
  });

  /**
   * Gets triggered on product pageview.
   */
  subscribe(productIsReady$, ({ getState }) => {
    const state = getState();
    const getTrackingData = makeGetTrackingData();
    track('viewContent', getTrackingData(state, getCurrentRoute(state)), state);
  });
}
