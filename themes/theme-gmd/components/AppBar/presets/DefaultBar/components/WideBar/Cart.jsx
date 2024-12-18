import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import { Ripple } from '@shopgate/engage/components';
import { CartIcon } from '@shopgate/pwa-ui-shared';
import connect from './Cart.connector';
import CartBadge from '../CartBadge';

const styles = {
  root: css({
    cursor: 'pointer',
    marginLeft: 32,
  }).toString(),
  ripple: css({
    display: 'flex',
    flexDirection: 'row',
    margin: -12,
    padding: 12,
  }).toString(),
  priceContainer: css({
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1,
  }).toString(),
  priceHeader: css({
    textAlign: 'right',
    fontSize: 10,
    fontWeight: '500',
    paddingBottom: 4,
    color: 'var(--color-primary)',
    textTransform: 'uppercase',
  }).toString(),
  price: css({
    fontSize: 24,
    textAlign: 'right',
    color: 'var(--color-primary)',
  }).toString(),
  icon: css({
    display: 'flex',
    flexShrink: 0,
    fontSize: 35,
    marginLeft: 18,
    justifyContent: 'center',
    alignItems: 'flex-end',
    outline: 0,
    color: 'var(--color-primary)',
    padding: 0,
    position: 'relative',
  }).toString(),
};

const badgeStyles = {
  background: 'var(--color-primary)',
  color: 'var(--color-primary-contrast)',
  top: -2,
  right: 2,
  boxShadow: 'none',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

/**
 * Search component
 * @returns {JSX}
 */
const Cart = ({
  navigate,
  total,
  currency,
  count,
}) => (
  currency ? (
    <div className={styles.root}>
      <Ripple onClick={navigate} className={styles.ripple} color="var(--color-primary)" fill>
        <div className={styles.priceContainer}>
          <span className={styles.priceHeader}>{i18n.text('cart.current_total')}</span>
          <span className={styles.price}>
            {i18n.price(total?.amount || 0, currency, true)}
          </span>
        </div>
        <div className={styles.icon}>
          <CartIcon />
          {count > 0 ? (
            <CartBadge
              style={badgeStyles}
              count={count}
            />
          ) : null}
        </div>
      </Ripple>
    </div>
  ) : null
);

Cart.propTypes = {
  count: PropTypes.number.isRequired,
  navigate: PropTypes.func.isRequired,
  currency: PropTypes.string,
  total: PropTypes.shape(),
};

Cart.defaultProps = {
  currency: null,
  total: null,
};

export default connect(Cart);
