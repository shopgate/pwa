// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import { I18n, ContextMenu } from '@shopgate/engage/components';

type Props = {
  onClick?: Function;
  closeMenu?: Function;
}

/**
 * @param {Object} props The component props.
 * @property {Function} props.onClick onClick
 * @property {Function} props.closeMenu closeMenu
 * @returns {JSX}
 */
export const CartContextMenuItemChangeFulfillment = (props: Props) => {
  const { onClick, closeMenu } = props;

  return (
    <ContextMenu.Item onClick={onClick} closeMenu={closeMenu}>
      <I18n.Text string="locations.change_fulfillment_method" />
    </ContextMenu.Item>
  );
};

CartContextMenuItemChangeFulfillment.defaultProps = {
  onClick: noop,
  closeMenu: noop,
};
