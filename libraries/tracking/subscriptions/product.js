import { receivedVisibleProduct$ } from '@shopgate/pwa-common-commerce/product/streams';
import { productIsReady$, variantDidChange$ } from '../streams/product';
import {
  getSelectedVariantFormatted,
  getBaseProductFormatted,
  getProductFormatted,
} from '../selectors/product';
import getPage from '../selectors/page';
import { track } from '../helpers';

/**
 * Product tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function product(subscribe) {
  subscribe(receivedVisibleProduct$, ({ action, getState }) => {
    const { id, baseProductId } = action.productData;

    const props = {
      productId: baseProductId !== null ? baseProductId : id,
      variantId: baseProductId !== null ? id : null,
    };

    const state = getState();
    let trackingData;

    if (props.variantId) {
      trackingData = {
        variant: getSelectedVariantFormatted(state, props),
        baseProduct: getBaseProductFormatted(state, props),
      };
    } else {
      trackingData = {
        page: getPage(state, props),
        product: getProductFormatted(state, props),
      };
    }
  });

  subscribe(productIsReady$, (data) => {
    console.warn('productIsReady$', data, data.action);
  });
}

/**
 * Product tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export function productx(subscribe) {
  /**
   * Gets triggered on product variant change/selection.
   */
  subscribe(variantDidChange$, ({ getState }) => {
    const state = getState();
    const trackingData = {
      variant: getSelectedVariantFormatted(state),
      baseProduct: getBaseProductFormatted(state),
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
      product: getProductFormatted(state),
    };

    track('viewContent', trackingData, state);
  });
}
