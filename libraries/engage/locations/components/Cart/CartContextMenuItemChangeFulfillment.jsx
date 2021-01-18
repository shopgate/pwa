// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import { I18n, ContextMenu } from '@shopgate/engage/components';
import connect from './CartContextMenuItemChangeFulfillment.connector';

type Props = {
  shopFulfillmentMethods?: Array;
  onClick?: Function;
  closeMenu?: Function;
}

/**
 * @param {Object} props The component props.
 * @property {Function} props.onClick onClick
 * @property {Function} props.closeMenu closeMenu
 * @returns {JSX}
 */
const MenuItem = connect((props: Props) => {
  const { shopFulfillmentMethods, onClick, closeMenu } = props;

  if (!shopFulfillmentMethods || !shopFulfillmentMethods.length) {
    return null;
  }

  return (
    <ContextMenu.Item onClick={onClick} closeMenu={closeMenu}>
      <I18n.Text string="locations.change_fulfillment_method" />
    </ContextMenu.Item>
  );
});

MenuItem.defaultProps = {
  onClick: noop,
  closeMenu: noop,
  shopFulfillmentMethods: null,
};

export const CartContextMenuItemChangeFulfillment = connect(MenuItem);

