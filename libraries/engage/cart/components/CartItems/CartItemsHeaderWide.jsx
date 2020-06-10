import React, { Fragment } from 'react';
import { hot } from 'react-hot-loader/root';
import { I18n } from '@shopgate/engage/components';
import {
  header,
  column,
  imageColumn,
  detailsColumn,
  locationColumn,
  contextMenuColumn,
  quantityPickerColumn,
  quantityPickerColumnNotEditable,
} from './CartItemsHeaderWide.style';
import connect from './CartItemsHeaderWide.connector';

type Props = {
  editable?: boolean,
  isOrderDetails?: boolean,
  enabledFulfillmentMethodsCount: number,
}

/**
 * @returns {JSX}
 */
const CartItemsHeaderWide = ({
  editable,
  isOrderDetails,
  enabledFulfillmentMethodsCount,
}: Props) => (
  <div className={header}>
    <div className={imageColumn}>
      <I18n.Text string="cart.items" />
    </div>
    <div className={detailsColumn} />
    <div className={column}>
      <I18n.Text string="cart.price" />
    </div>
    {isOrderDetails && (
      <Fragment>
        <div className={locationColumn}>
          <I18n.Text string="cart.location" />
        </div>
        <div className={column}>
          <I18n.Text string="cart.status" />
        </div>
        <div className={column}>
          <I18n.Text string="cart.fulfilled_quantity" />
        </div>
      </Fragment>
    )}
    <div className={editable ? quantityPickerColumn : quantityPickerColumnNotEditable}>
      <I18n.Text string={isOrderDetails ? 'cart.ordered_quantity' : 'cart.quantity'} />
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
  isOrderDetails: false,
};

export default hot(connect(CartItemsHeaderWide));
