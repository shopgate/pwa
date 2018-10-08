import { SUCCESS_ADD_COUPONS_TO_CART } from '@shopgate/pwa-common-commerce/cart/constants';
import { couponsUpdated$ } from '@shopgate/pwa-common-commerce/cart/streams';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';

/**
 * Coupons subscription.
 * @param {Function} subscribe The subscribe function.
 */
export default function coupon(subscribe) {
  // Derived stream with just the successful case.
  const successfullyAddedCouponsToCart$ = couponsUpdated$.filter((
    ({ action }) => action.type === SUCCESS_ADD_COUPONS_TO_CART
  ));

  subscribe(successfullyAddedCouponsToCart$, ({ dispatch }) => {
    dispatch(showModal({
      dismiss: null,
      confirm: 'modal.ok',
      title: 'cart.coupon_was_added',
    }));
  });
}
