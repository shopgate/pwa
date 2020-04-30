import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import I18n from '@shopgate/pwa-common/components/I18n';
import Link from '@shopgate/pwa-common/components/Link';
import { SurroundPortals } from '@shopgate/engage/components';
import { CART_CHECKOUT_BUTTON } from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { GUEST_CHECKOUT_PATTERN } from '@shopgate/engage/checkout';
import { CartContext } from '../../cart.context';
import { button, disabledButton } from './CartSummaryWideCheckoutButton.style';
import connect from './CartSummaryWideCheckoutButton.connector';

type Props = {
  isOrderable?: boolean;
  isGuestCheckoutActive?: boolean;
}

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const CartSummaryWideCheckoutButton = ({ isOrderable, isGuestCheckoutActive }:Props) => {
  const { isLoading } = useContext(CartContext);
  const isActive = useMemo(() => (isOrderable && !isLoading), [isLoading, isOrderable]);
  const checkoutPath = useMemo(
    () => (!isGuestCheckoutActive ? CHECKOUT_PATH : GUEST_CHECKOUT_PATTERN),
    [isGuestCheckoutActive]
  );

  const classes = classNames(button, {
    [disabledButton]: !isActive,
  });

  return (
    <SurroundPortals portalName={CART_CHECKOUT_BUTTON} props={{ isActive }}>
      <Link href={checkoutPath} disabled={!isActive}>
        <RippleButton
          disabled={!isActive}
          type="regular"
          className={classes}
        >
          <I18n.Text string="cart.checkout" />
        </RippleButton>
      </Link>
    </SurroundPortals>
  );
};

CartSummaryWideCheckoutButton.defaultProps = {
  isOrderable: true,
  isGuestCheckoutActive: false,
};

export default connect(CartSummaryWideCheckoutButton);
