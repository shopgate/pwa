import React from 'react';
import { hot } from 'react-hot-loader/root';
import { I18n } from '@shopgate/engage/components';
import {
  header,
  column,
  imageColumn,
  detailsColumn,
  contextMenuColumn,
  quantityPickerColumn,
} from './CartItemsHeaderWide.style';

type Props = {
  editable?: boolean,
}

/**
 * @returns {JSX}
 */
const CartItemsHeaderWide = ({ editable }: Props) => (
  <div className={header}>
    <div className={imageColumn}>
      <I18n.Text string="cart.items" />
    </div>
    <div className={detailsColumn} />
    <div className={column}>
      <I18n.Text string="cart.price" />
    </div>
    <div className={quantityPickerColumn}>
      <I18n.Text string="cart.quantity" />
    </div>
    <div className={column}>
      <I18n.Text string="cart.subtotal" />
    </div>
    { editable && (
      <div className={contextMenuColumn} />
    )}
  </div>
);

CartItemsHeaderWide.defaultProps = {
  editable: true,
};

export default hot(CartItemsHeaderWide);
