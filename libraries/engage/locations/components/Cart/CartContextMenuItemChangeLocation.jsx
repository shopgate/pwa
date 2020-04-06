// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import { I18n, ContextMenu } from '@shopgate/engage/components';
import { DIRECT_SHIP } from '../../constants';

type Props = {
  cartItem: Object;
  onClick?: Function;
  closeMenu?: Function;
}

/**
 * @param {Object} props The component props.
 * @property {Object} props.cartItem cartItem
 * @property {Function} props.onClick onClick
 * @property {Function} props.closeMenu closeMenu
 * @returns {JSX}
 */
export const CartContextMenuItemChangeLocation = (props: Props) => {
  const { cartItem, onClick, closeMenu } = props;

  if (!cartItem.fulfillment || cartItem.fulfillment.method === DIRECT_SHIP) {
    return null;
  }

  return (
    <ContextMenu.Item onClick={onClick} closeMenu={closeMenu}>
      <I18n.Text string="locations.change_location" />
    </ContextMenu.Item>
  );
};

CartContextMenuItemChangeLocation.defaultProps = {
  onClick: noop,
  closeMenu: noop,
};
