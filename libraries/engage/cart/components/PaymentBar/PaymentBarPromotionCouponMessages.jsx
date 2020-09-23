import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { css } from 'glamor';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { errorBehavior } from '@shopgate/engage/core';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { CartContext } from '../../cart.context';
import { spacer } from './PaymentBarContent.style';

const styles = {
  line: css({
    justifyContent: 'start',
    [responsiveMediaQuery('<=xs', { appAlways: true })]: {
      fontSize: '0.75rem',
      paddingBottom: 3,
    },
  }).toString(),
  message: css({
    order: 2,
  }).toString(),
  error: css({
    color: 'var(--color-state-alert)',
  }).toString(),
  warning: css({
    color: 'var(--color-state-warning)',
  }).toString(),
  info: css({
    color: 'var(--color-state-ok)',
  }).toString(),
  loading: css({
    opacity: 0.4,
  }).toString(),
};

/**
 * @param {Object} props The components props
 * @returns {JSX}
 */
const PaymentBarPromotionCouponMessages = ({ messages }) => {
  const { isLoading } = useContext(CartContext);
  if (!messages.length) {
    return null;
  }

  return messages.map(({ message, additionalParams, type }) => (
    <CartTotalLine className={styles.line} key={message}>
      <Fragment>
        <CartTotalLine.Spacer className={spacer} />
        <div className={classNames(styles.message, {
          [styles.loading]: isLoading,
          [styles.error]: type === 'error',
          [styles.warning]: type === 'warning',
          [styles.info]: type === 'info',
        })}
        >
          {errorBehavior.getErrorMessage(message, additionalParams)}
        </div>
      </Fragment>
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
