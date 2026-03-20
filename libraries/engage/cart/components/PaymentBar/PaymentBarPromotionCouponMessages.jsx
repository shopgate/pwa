import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { errorBehavior, isIOSTheme } from '@shopgate/engage/core';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { CartContext } from '../../cart.context';

const useStyles = makeStyles()({
  line: {
    justifyContent: 'start',
    [responsiveMediaQuery('<=xs', { appAlways: true })]: {
      fontSize: '0.75rem',
      paddingBottom: 3,
    },
  },
  message: {
    order: 2,
  },
  error: {
    color: 'var(--color-state-alert)',
  },
  warning: {
    color: 'var(--color-state-warning)',
  },
  info: {
    color: 'var(--color-state-ok)',
  },
  loading: {
    opacity: 0.4,
  },
  spacer: {
    width: isIOSTheme() ? 27 : 32,
    order: 1,
    flexShrink: 0,
  },
});

/**
 * @param {Object} props The components props
 * @returns {JSX}
 */
const PaymentBarPromotionCouponMessages = ({ messages }) => {
  const { classes, cx } = useStyles();
  const { isLoading } = useContext(CartContext);
  if (!messages.length) {
    return null;
  }

  return messages.map(({ message, additionalParams, type }) => (
    <CartTotalLine className={classes.line} key={message}>
      <>
        <CartTotalLine.Spacer className={classes.spacer} />
        <div className={cx(classes.message, {
          [classes.loading]: isLoading,
          [classes.error]: type === 'error',
          [classes.warning]: type === 'warning',
          [classes.info]: type === 'info',
        })}
        >
          {errorBehavior.getErrorMessage(message, additionalParams)}
        </div>
      </>
    </CartTotalLine>
  ));
};

PaymentBarPromotionCouponMessages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape()),
};

PaymentBarPromotionCouponMessages.defaultProps = {
  messages: [],
};

export default PaymentBarPromotionCouponMessages;
