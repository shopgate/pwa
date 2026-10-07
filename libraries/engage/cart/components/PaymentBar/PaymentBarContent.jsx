import * as React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { isIOSTheme } from '@shopgate/engage/core';
import { SurroundPortals } from '@shopgate/engage/components';
import { CART_PAYMENT_BAR } from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import PaymentBarTotals from './PaymentBarTotals';
import PaymentBarCheckoutButton from './PaymentBarCheckoutButton';

const useStyles = makeStyles()(theme => ({
  wrapper: {
    background: theme.palette.background.surface,
    boxShadow: '0 -4px 5px -2px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    zIndex: 2,
    paddingBottom: theme.layout.safeArea.bottom,
  },
  checkoutButton: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  checkoutButtonContainer: {
    background: theme.palette.background.surface,
    alignItems: 'center',
    padding: isIOSTheme() ? theme.spacing(1) : theme.spacing(2),
    position: 'relative',
    zIndex: 2,
  },
  embeddedButtonContainer: {
    background: 'transparent',
  },
}));

/**
 * The PaymentBarContent component.
 * @param {Object} props The component props.
 * @param {boolean} props.showSeparator Whether the total lines show separators.
 * @param {boolean} props.embedded Whether a surrounding footer bar provides background, shadow
 * and the bottom inset.
 * @param {boolean} props.checkoutOnly Whether only the checkout button is rendered, with the grand
 * total in its label.
 * @returns {JSX}
 */
function PaymentBarContent({ showSeparator, embedded, checkoutOnly }) {
  const { classes, cx } = useStyles();
  return (
    <div className={cx({ [classes.wrapper]: !embedded }, 'theme__cart__payment-bar')}>
      <SurroundPortals portalName={CART_PAYMENT_BAR}>
        {!checkoutOnly && <PaymentBarTotals showSeparator={showSeparator} />}
        <div
          className={cx(classes.checkoutButtonContainer, {
            [classes.embeddedButtonContainer]: embedded,
          })}
        >
          <div className={classes.checkoutButton}>
            <PaymentBarCheckoutButton showTotal={checkoutOnly} />
          </div>
        </div>
      </SurroundPortals>
    </div>
  );
}

PaymentBarContent.propTypes = {
  checkoutOnly: PropTypes.bool,
  embedded: PropTypes.bool,
  showSeparator: PropTypes.bool,
};

PaymentBarContent.defaultProps = {
  checkoutOnly: false,
  embedded: false,
  showSeparator: true,
};

export default PaymentBarContent;
