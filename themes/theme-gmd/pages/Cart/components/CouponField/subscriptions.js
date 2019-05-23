import { SUCCESS_ADD_COUPONS_TO_CART, couponsUpdated$ } from '@shopgate/engage/cart';
import { showModal } from '@shopgate/engage/core';

/**
 * Coupons subscription.
 * @param {Function} subscribe The subscribe function.
 */
export default function coupon(subscribe) {
  // Derived stream with just the successful case.
  const successfullyAddedCouponsToCart$ = couponsUpdated$
    .filter(({ action }) => action.type === SUCCESS_ADD_COUPONS_TO_CART);

  subscribe(successfullyAddedCouponsToCart$, ({ dispatch }) => {
    dispatch(showModal({
      dismiss: null,
      confirm: 'modal.ok',
      title: 'cart.coupon_was_added',
    }));
  });
}
