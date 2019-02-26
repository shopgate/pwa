import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { variantDidChange$ } from '@shopgate/pwa-common-commerce/product/streams';
import { productIsReady$ } from '../streams/product';
import { getBaseProductFormatted, getProductFormatted } from '../selectors/product';
import getPage from '../selectors/page';
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
    const { params: { productId } } = getCurrentRoute(getState());
    const props = { productId: hex2bin(productId) };

    const trackingData = {
      page: getPage(state),
      product: getProductFormatted(state, props),
    };

    track('viewContent', trackingData, state);
  });
}
