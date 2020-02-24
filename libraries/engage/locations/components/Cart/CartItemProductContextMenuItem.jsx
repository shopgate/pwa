// @flow
import React from 'react';
import noop from 'lodash/noop';
import { I18n, ContextMenu } from '@shopgate/engage/components';

type Props = {
  cartItem: Object;
  onClick?: Function;
  closeMenu?: Function;
}

/**
 * @param {Object} cartItem cartItem
 * @param {Function} onClick onClick
 * @param {Function} closeMenu closeMenu
 * @returns {JSX}
 */
const CartItemProductContextMenuItem = ({ cartItem, onClick, closeMenu }: Props) => {
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

CartItemProductContextMenuItem.defaultProps = {
  onClick: noop,
  closeMenu: noop,
};

export default CartItemProductContextMenuItem;
