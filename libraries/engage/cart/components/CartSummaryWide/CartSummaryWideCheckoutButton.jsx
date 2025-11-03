import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { SurroundPortals, I18n, Link } from '@shopgate/engage/components';
import { CART_CHECKOUT_BUTTON } from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import PropTypes from 'prop-types';
import { CartContext } from '../../cart.context';
import { container, button, disabledButton } from './CartSummaryWideCheckoutButton.style';
import connect from './CartSummaryWideCheckoutButton.connector';

/**
 * @param {Object} props The component props
 * @param {boolean} props.isOrderable Indicates whether the cart is orderable.
 * @returns {JSX.Element}
 */
const CartSummaryWideCheckoutButton = ({ isOrderable }) => {
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

CartSummaryWideCheckoutButton.propTypes = {
  isOrderable: PropTypes.bool,
};

CartSummaryWideCheckoutButton.defaultProps = {
  isOrderable: true,
};

export default connect(CartSummaryWideCheckoutButton);
