import React, { useContext, useMemo } from 'react';
import { I18n, Link, SurroundPortals } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { CART_CHECKOUT_BUTTON } from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import PropTypes from 'prop-types';
import { CartContext } from '../../cart.context';
import connect from './PaymentBarCheckoutButton.connector';

const useStyles = makeStyles()(theme => ({
  button: {
    width: '100%',
    background: theme.palette.ctaButton.background,
    color: `${theme.palette.ctaButton.background.contrastText}!important`,
  },
  disabledButton: {
    width: '100%',
    background: theme.palette.disabledButton.background,
    color: `${theme.palette.disabledButton.background.contrastText}!important`,
  },
}));

/**
 * Renders the cart payment bar checkout button.
 * @param {boolean} isOrderable Whether the cart is orderable.
 * @return {JSX.Element}
 */
const PaymentBarCheckoutButton = ({ isOrderable }) => {
  const { classes } = useStyles();
  const { isLoading } = useContext(CartContext);
  const isActive = useMemo(() => (isOrderable && !isLoading), [isLoading, isOrderable]);

  return (
    <SurroundPortals portalName={CART_CHECKOUT_BUTTON} portalProps={{ isActive }}>
      <Link href={CHECKOUT_PATH} disabled={!isActive} tabIndex={0} role="button" aria-disabled={!isActive}>
        <RippleButton
          disabled={!isActive}
          type="regular"
          className={isActive ? classes.button : classes.disabledButton}
        >
          <I18n.Text string="cart.checkout" />
        </RippleButton>
      </Link>
    </SurroundPortals>
  );
};

PaymentBarCheckoutButton.propTypes = {
  isOrderable: PropTypes.bool,
};

PaymentBarCheckoutButton.defaultProps = {
  isOrderable: true,
};

export default connect(PaymentBarCheckoutButton);
