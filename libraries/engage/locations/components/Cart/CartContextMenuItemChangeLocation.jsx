import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { I18n, ContextMenu } from '@shopgate/engage/components';
import { DIRECT_SHIP } from '../../constants';

/**
 * Renders the cart context menu item for changing the location.
 * @param {Object} props The component props.
 * @param {Object} props.cartItem The cart item.
 * @param {Function} [props.onClick=noop] The click handler.
 * @param {Function} [props.closeMenu=noop] The menu close handler.
 * @returns {JSX.Element|null} The rendered component or null.
 */
export const CartContextMenuItemChangeLocation = ({ cartItem, onClick, closeMenu }) => {
  if (!cartItem.fulfillment || cartItem.fulfillment.method === DIRECT_SHIP) {
    return null;
  }

  return (
    <ContextMenu.Item onClick={onClick} closeMenu={closeMenu}>
      <I18n.Text string="locations.change_location" />
    </ContextMenu.Item>
  );
};

CartContextMenuItemChangeLocation.propTypes = {
  cartItem: PropTypes.shape({
    fulfillment: PropTypes.shape({
      method: PropTypes.string,
    }),
  }).isRequired,
  closeMenu: PropTypes.func,
  onClick: PropTypes.func,
};

CartContextMenuItemChangeLocation.defaultProps = {
  onClick: noop,
  closeMenu: noop,
};
