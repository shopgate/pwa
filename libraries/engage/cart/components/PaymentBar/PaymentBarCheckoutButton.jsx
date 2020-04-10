// @flow
import React, { useContext, useMemo } from 'react';
import I18n from '@shopgate/pwa-common/components/I18n';
import Link from '@shopgate/pwa-common/components/Link';
import { SurroundPortals } from '@shopgate/engage/components';
import { CART_CHECKOUT_BUTTON } from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { GUEST_CHECKOUT_PATTERN } from '@shopgate/engage/checkout';
import { CartContext } from '../../cart.context';
import connect from './PaymentBarCheckoutButton.connector';
import { button, disabledButton } from './PaymentBarCheckoutButton.style';

type Props = {
  isOrderable?: boolean;
  isGuestCheckoutActive?: boolean;
}

/**
 * Renders the cart payment bar checkout button.
 * @param {boolean} isOrderable Whether the cart is orderable.
 * @return {JSX}
 */
function PaymentBarCheckoutButton({ isOrderable, isGuestCheckoutActive }: Props) {
  const { isLoading } = useContext(CartContext);
  const isActive = useMemo(() => (isOrderable && !isLoading), [isLoading, isOrderable]);
  const checkoutPath = useMemo(
    () => (!isGuestCheckoutActive ? CHECKOUT_PATH : GUEST_CHECKOUT_PATTERN),
    [isGuestCheckoutActive]
  );

  return (
    <SurroundPortals portalName={CART_CHECKOUT_BUTTON} props={{ isActive }}>
      <Link href={checkoutPath} disabled={!isActive}>
        <RippleButton
          disabled={!isActive}
          type="regular"
          className={isActive ? button : disabledButton}
        >
          <I18n.Text string="cart.checkout" />
        </RippleButton>
      </Link>
    </SurroundPortals>
  );
}

PaymentBarCheckoutButton.defaultProps = {
  isOrderable: true,
  isGuestCheckoutActive: false,
};

export default connect(PaymentBarCheckoutButton);
