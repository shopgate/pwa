import * as React from 'react';
import noop from 'lodash/noop';
import { I18n, ContextMenu } from '@shopgate/engage/components';
import { DIRECT_SHIP } from '@shopgate/engage/locations';
import connect from './CartContextMenuItemChangeFulfillment.connector';

/**
 * @param {Object} props The component props.
 * @property {Function} props.onClick onClick
 * @property {Function} props.closeMenu closeMenu
 * @returns {JSX}
 */
export const CartContextMenuItemChangeFulfillment = connect((props) => {
  const {
    onClick, closeMenu, enabledFulfillmentMethods, cartItem,
  } = props;

  if (!cartItem.fulfillment || !enabledFulfillmentMethods.includes(DIRECT_SHIP)) {
    return null;
  }

  return (
    <ContextMenu.Item onClick={onClick} closeMenu={closeMenu}>
      <I18n.Text string="locations.change_fulfillment_method" />
    </ContextMenu.Item>
  );
});

CartContextMenuItemChangeFulfillment.defaultProps = {
  onClick: noop,
  closeMenu: noop,
};
