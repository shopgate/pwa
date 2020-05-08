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
  quantityPickerColumnNotEditable,
} from './CartItemsHeaderWide.style';
import connect from './CartItemsHeaderWide.connector';

type Props = {
  editable?: boolean,
  enabledFulfillmentMethodsCount: number,
}

/**
 * @returns {JSX}
 */
const CartItemsHeaderWide = ({ editable, enabledFulfillmentMethodsCount }: Props) => (
  <div className={header}>
    <div className={imageColumn}>
      <I18n.Text string="cart.items" />
    </div>
    <div className={detailsColumn} />
    <div className={column}>
      <I18n.Text string="cart.price" />
    </div>
    <div className={editable ? quantityPickerColumn : quantityPickerColumnNotEditable}>
      <I18n.Text string="cart.quantity" />
    </div>
    <div className={column}>
      <I18n.Text string="cart.subtotal" />
    </div>
    { editable && enabledFulfillmentMethodsCount > 1 && (
      <div className={contextMenuColumn} />
    )}
  </div>
);

CartItemsHeaderWide.defaultProps = {
  editable: true,
};

export default hot(connect(CartItemsHeaderWide));
