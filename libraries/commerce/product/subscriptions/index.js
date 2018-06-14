import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import setTitle from '@shopgate/pwa-common/actions/view/setTitle';
import { getProductName } from '@shopgate/pwa-common-commerce/product/selectors/product';
import getProduct from '../actions/getProduct';
import getProductDescription from '../actions/getProductDescription';
import getProductProperties from '../actions/getProductProperties';
import getProductImages from '../actions/getProductImages';
import getProductShipping from '../actions/getProductShipping';
import getProductVariants from '../actions/getProductVariants';
import getProductOptions from '../actions/getProductOptions';
import {
  productWillEnter$,
  productReceived$,
  cachedProductReceived$,
  receivedVisibleProduct$,
} from '../streams';

/**
 * Product subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
function product(subscribe) {
  const processProduct$ = productReceived$.merge(cachedProductReceived$);

  subscribe(productWillEnter$, ({ action, dispatch, getState }) => {
    const { productId } = action.route.params;
    const id = hex2bin(productId);
    let { title } = action.route.state;

    dispatch(getProduct(id));
    dispatch(getProductDescription(id));
    dispatch(getProductProperties(id));
    dispatch(getProductImages(id));
    dispatch(getProductShipping(id));

    // If a title didn't come in then try to lookup the product and grab its name.
    if (!title) {
      title = getProductName(getState(), { productId: id });
    }

    if (title) {
      dispatch(setTitle(title));
    }
  });

  subscribe(processProduct$, ({ action, dispatch }) => {
    const {
      id,
      flags = {
        hasVariants: false,
        hasOptions: false,
      },
      baseProductId,
    } = action.productData;

    if (baseProductId) {
      dispatch(getProduct(baseProductId));
    }

    if (flags.hasVariants) {
      dispatch(getProductVariants(id));
    }

    if (flags.hasOptions) {
      dispatch(getProductOptions(id));
    }
  });

  subscribe(receivedVisibleProduct$, ({ action, dispatch }) => {
    dispatch(setTitle(action.productData.name));
  });
}

export default product;
