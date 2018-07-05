import { variantDidChange$ } from '@shopgate/pwa-common-commerce/product/streams';
import { productIsReady$ } from '../streams/product';
import {
  getSelectedVariantFormatted,
  getCurrentBaseProductFormatted,
  getCurrentProductFormatted,
} from '../selectors/product';
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
  subscribe(variantDidChange$, ({ getState }) => {
    const state = getState();
    const trackingData = {
      variant: getSelectedVariantFormatted(state),
      baseProduct: getCurrentBaseProductFormatted(state),
    };

    track('variantSelected', trackingData, state);
  });

  /**
   * Gets triggered on product pageview.
   */
  subscribe(productIsReady$, ({ getState }) => {
    const state = getState();
    const trackingData = {
      page: getPage(state),
      product: getCurrentProductFormatted(state),
    };

    track('viewContent', trackingData, state);
  });
}
