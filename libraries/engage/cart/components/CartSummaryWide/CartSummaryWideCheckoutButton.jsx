import React, { useContext, useMemo } from 'react';
import { SurroundPortals, I18n, Link } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { CART_CHECKOUT_BUTTON } from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import PropTypes from 'prop-types';
import { CartContext } from '../../cart.context';
import connect from './CartSummaryWideCheckoutButton.connector';

const useStyles = makeStyles()(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    width: '100%',
    background: theme.palette.ctaButton.background,
    color: `${theme.palette.ctaButton.background.contrastText}!important`,
    borderRadius: 4,
    margin: theme.spacing(2, 0),
  },
  disabledButton: {
    background: theme.palette.disabledButton.background,
    color: `${theme.palette.disabledButton.background.contrastText}!important`,
  },
}));

/**
 * @param {Object} props The component props
 * @param {boolean} props.isOrderable Indicates whether the cart is orderable.
 * @returns {JSX.Element}
 */
const CartSummaryWideCheckoutButton = ({ isOrderable }) => {
  const { classes, cx } = useStyles();
  const { isLoading } = useContext(CartContext);
  const isActive = useMemo(() => (isOrderable && !isLoading), [isLoading, isOrderable]);

  const buttonClassName = cx(classes.button, {
    [classes.disabledButton]: !isActive,
  });

  return (
    <div className={classes.container}>
      <SurroundPortals portalName={CART_CHECKOUT_BUTTON} portalProps={{ isActive }}>
        <Link href={CHECKOUT_PATH} disabled={!isActive}>
          <RippleButton
            disabled={!isActive}
            type="regular"
            className={buttonClassName}
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
