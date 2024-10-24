import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import I18n from '@shopgate/pwa-common/components/I18n';
import Link from '@shopgate/pwa-common/components/Link';
import { SurroundPortals } from '@shopgate/engage/components';
import { CART_CHECKOUT_BUTTON } from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { CartContext } from '../../cart.context';
import { container, button, disabledButton } from './CartSummaryWideCheckoutButton.style';
import connect from './CartSummaryWideCheckoutButton.connector';

type Props = {
  isOrderable?: boolean;
}

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const CartSummaryWideCheckoutButton = ({ isOrderable }:Props) => {
  const { isLoading } = useContext(CartContext);
  const isActive = useMemo(() => (isOrderable && !isLoading), [isLoading, isOrderable]);

  const classes = classNames(button, {
    [disabledButton]: !isActive,
  });

  return (
    <div className={container}>
      <SurroundPortals portalName={CART_CHECKOUT_BUTTON} portalProps={{ isActive }}>
        <Link href={CHECKOUT_PATH} disabled={!isActive}>
          <RippleButton
            disabled={!isActive}
            type="regular"
            className={classes}
          >
            <I18n.Text string="cart.checkout" />
          </RippleButton>
        </Link>
      </SurroundPortals>
    </div>
  );
};

CartSummaryWideCheckoutButton.defaultProps = {
  isOrderable: true,
};

export default connect(CartSummaryWideCheckoutButton);
