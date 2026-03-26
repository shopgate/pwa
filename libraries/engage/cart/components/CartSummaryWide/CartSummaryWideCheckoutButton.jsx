import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { SurroundPortals, I18n, Link } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { CART_CHECKOUT_BUTTON } from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import PropTypes from 'prop-types';
import { CartContext } from '../../cart.context';
import connect from './CartSummaryWideCheckoutButton.connector';

const { colors } = themeConfig;

const useStyles = makeStyles()(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    width: '100%',
    background: 'var(--color-button-cta)',
    color: 'var(--color-button-cta-contrast)!important',
    borderRadius: 4,
    margin: theme.spacing(2, 0),
  },
  disabledButton: {
    background: colors.shade7,
    color: `${colors.shade4}!important`,
  },
}));

/**
 * @param {Object} props The component props
 * @param {boolean} props.isOrderable Indicates whether the cart is orderable.
 * @returns {JSX.Element}
 */
const CartSummaryWideCheckoutButton = ({ isOrderable }) => {
  const { classes } = useStyles();
  const { isLoading } = useContext(CartContext);
  const isActive = useMemo(() => (isOrderable && !isLoading), [isLoading, isOrderable]);

  const buttonClassName = classNames(classes.button, {
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
