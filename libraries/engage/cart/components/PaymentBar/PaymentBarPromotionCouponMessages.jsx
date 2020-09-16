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
  error: css({
    order: 2,
    color: 'var(--color-state-alert)',
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

  return messages.map(({ message, additionalParams }) => (
    <CartTotalLine className={styles.line} key={message}>
      <Fragment>
        <CartTotalLine.Spacer className={spacer} />
        <div className={classNames(styles.error, { [styles.loading]: isLoading })}>
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
