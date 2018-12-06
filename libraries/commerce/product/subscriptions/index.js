import { hex2bin } from '@shopgate/pwa-common/helpers/data';
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
  productRelationsReceived$,
} from '../streams';
import getProductsById from '../actions/getProductsById';
import { getProductRelationsByHash } from '../selectors/relations';

/**
 * Product subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
function product(subscribe) {
  const processProduct$ = productReceived$.merge(cachedProductReceived$);

  subscribe(productWillEnter$, ({ action, dispatch }) => {
    const { productId } = action.route.params;
    const id = hex2bin(productId);

    dispatch(getProduct(id));
    dispatch(getProductDescription(id));
    dispatch(getProductProperties(id));
    dispatch(getProductImages(id));
    dispatch(getProductShipping(id));
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
      dispatch(getProductImages(baseProductId));
    }

    if (flags.hasVariants) {
      dispatch(getProductVariants(id));
    }

    if (flags.hasOptions) {
      dispatch(getProductOptions(id));
    }
  });

  subscribe(productRelationsReceived$, ({ dispatch, getState, action }) => {
    const { hash } = action;
    const productIds = getProductRelationsByHash(hash)(getState());

    dispatch(getProductsById(productIds));
  });
}

export default product;
