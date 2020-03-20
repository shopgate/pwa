import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useWidgetSettings } from '@shopgate/engage/core';
import { CART_MAX_ITEMS } from '@shopgate/engage/cart';
import styles from './style';

/**
 * The CartButtonBadge component.
 * @returns {JSX}
 */
const CartButtonBadge = ({ count, style }) => {
  const settings = useWidgetSettings('@shopgate/engage/components/AppBar');

  const badgeStyle = {
    ...style,
    boxShadow: settings.buttonCartBadgeShadow,
  };

  const productCount = count > CART_MAX_ITEMS ? `${CART_MAX_ITEMS}+` : count;

  return (
    <div style={badgeStyle} className={styles}>{productCount}</div>
  );
};

CartButtonBadge.propTypes = {
  count: PropTypes.number.isRequired,
  style: PropTypes.shape(),
};

CartButtonBadge.defaultProps = {
  style: null,
};

export default memo(CartButtonBadge);
