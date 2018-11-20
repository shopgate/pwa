import { main$ } from '@shopgate/pwa-common/streams/main';
import {
  RECEIVE_PRODUCT,
  SET_PRODUCT_VARIANT_ID,
  RECEIVE_PRODUCT_RELATIONS,
} from '../constants';
import { getSelectedVariant } from '../selectors/variants';

/**
 * Gets triggered when product data received.
 * @type {Observable}
 */
export const productReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_PRODUCT)
  .distinctUntilChanged();

/**
 * Gets triggered when VariantId changes.
 * @type {Observable}
 */
export const setVariantId$ = main$.filter(({ action }) => (
  action.type === SET_PRODUCT_VARIANT_ID &&
  action.productVariantId !== null
));

/**
 * Gets triggered when VariantId changes and product data received for this variant.
 * @type {Observable}
 */
export const variantDidChangeUncached$ = setVariantId$
  .switchMap(({ action }) => (
    productReceived$.filter(({ action: productAction }) => (
      productAction.productId === action.productVariantId
    ))
  ));

/**
 * Gets triggered when VariantId changes and product data is already there.
 * @type {Observable}
 */
const variantDidChangedCached = setVariantId$
  .filter(({ getState }) => !!getSelectedVariant(getState()));

/**
 * Gets triggered when VariantId changes and product data is available.
 * @type {Observable}
 */
export const variantDidChange$ = variantDidChangeUncached$.merge(variantDidChangedCached);

export const productRelationsReceived$ =
               main$.filter(({ action }) => action.type === RECEIVE_PRODUCT_RELATIONS);

