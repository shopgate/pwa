import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { I18n, ContextMenu } from '@shopgate/engage/components';

/**
 * @param {Object} cartItem cartItem
 * @param {Function} onClick onClick
 * @param {Function} closeMenu closeMenu
 * @returns {JSX}
 */
const CartItemProductContextMenuItem = ({ cartItem, onClick, closeMenu }) => {
  const { fulfillment } = cartItem;
  if (!fulfillment) {
    return null;
  }

  return (
    <ContextMenu.Item onClick={onClick} closeMenu={closeMenu}>
      <I18n.Text string="locations.change_location" />
    </ContextMenu.Item>
  );
};

CartItemProductContextMenuItem.propTypes = {
  cartItem: PropTypes.shape().isRequired,
  closeMenu: PropTypes.func,
  onClick: PropTypes.func,
};

CartItemProductContextMenuItem.defaultProps = {
  onClick: noop,
  closeMenu: noop,
};

export default CartItemProductContextMenuItem;
