import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import fetchProduct from '../actions/fetchProduct';
import fetchProductDescription from '../actions/fetchProductDescription';
import fetchProductProperties from '../actions/fetchProductProperties';
import fetchProductImages from '../actions/fetchProductImages';
import fetchProductShipping from '../actions/fetchProductShipping';
import fetchProductVariants from '../actions/fetchProductVariants';
import fetchProductOptions from '../actions/fetchProductOptions';
import { productImageFormats } from '../collections';
import {
  productWillEnter$,
  productReceived$,
  cachedProductReceived$,
  productRelationsReceived$,
} from '../streams';
import fetchProductsById from '../actions/fetchProductsById';
import { getProductRelationsByHash } from '../selectors/relations';
import { checkoutSucceeded$ } from '../../checkout/streams';
import expireProductById from '../action-creators/expireProductById';

/**
 * Product subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
function product(subscribe) {
  const processProduct$ = productReceived$.merge(cachedProductReceived$);

  subscribe(productWillEnter$, ({ action, dispatch }) => {
    const { productId } = action.route.params;
    const { productId: variantId } = action.route.state;
    const id = variantId || hex2bin(productId);

    dispatch(fetchProduct(id));
    dispatch(fetchProductDescription(id));
    dispatch(fetchProductProperties(id));
    dispatch(fetchProductImages(id, productImageFormats.getAllUniqueFormats()));
    dispatch(fetchProductShipping(id));
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
      dispatch(fetchProduct(baseProductId));
      dispatch(fetchProductImages(baseProductId, productImageFormats.getAllUniqueFormats()));
    }

    if (flags.hasVariants) {
      dispatch(fetchProductVariants(id));
    }

    if (flags.hasOptions) {
      dispatch(fetchProductOptions(id));
    }
  });

  subscribe(productRelationsReceived$, ({ dispatch, getState, action }) => {
    const { hash } = action;
    const productIds = getProductRelationsByHash(hash)(getState());

    dispatch(fetchProductsById(productIds));
  });

  /**
   * Expire products after checkout, fetch updated data
   */
  subscribe(checkoutSucceeded$, ({ dispatch, action }) => {
    const { products } = action;

    const productIds = products.map(p => p.product.id);
    productIds.forEach(id => dispatch(expireProductById(id)));

    dispatch(fetchProductsById(productIds));
  });
}

export default product;
