import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { I18n } from '@shopgate/engage/components';
import {
  header,
  column,
  priceColumnWide,
  imageColumn,
  detailsColumn,
  locationColumn,
  contextMenuColumn,
  quantityPickerColumn,
  quantityPickerColumnNotEditable,
} from './CartItemsHeaderWide.style';
import connect from './CartItemsHeaderWide.connector';

/**
 * The CartItemsHeaderWide component.
 * @param {Object} props The component props.
 * @param {boolean} [props.editable=true] Whether the cart is editable.
 * @param {boolean} [props.isOrderDetails=false] Whether the component is used in order details.
 * @param {boolean} [props.isDirectShipOnly=false] Whether the cart is direct ship only.
 * @param {boolean} [props.hasLineItemPromotions=false] Whether the cart has line item promotions.
 * @param {number} props.enabledFulfillmentMethodsCount The count of enabled fulfillment methods.
 * @returns {JSX.Element} The rendered component.
 */
const CartItemsHeaderWide = ({
  editable,
  isOrderDetails,
  enabledFulfillmentMethodsCount,
  hasLineItemPromotions,
  isDirectShipOnly,
}) => (
  <div className={header}>
    <div className={imageColumn}>
      <I18n.Text string="cart.items" />
    </div>
    <div className={detailsColumn} />
    <div className={classNames(column.toString(), {
      [priceColumnWide]: hasLineItemPromotions,
    })}
    >
      <I18n.Text string="cart.price" />
    </div>
    {isOrderDetails && (
    <>
      {!isDirectShipOnly ? (
        <div className={locationColumn}>
          <I18n.Text string="cart.location" />
        </div>
      ) : null}
      <div className={column}>
        <I18n.Text string="cart.status" />
      </div>
      <div className={column}>
        <I18n.Text string="cart.fulfilled_quantity" />
      </div>
    </>
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

CartItemsHeaderWide.propTypes = {
  enabledFulfillmentMethodsCount: PropTypes.number.isRequired,
  editable: PropTypes.bool,
  hasLineItemPromotions: PropTypes.bool,
  isDirectShipOnly: PropTypes.bool,
  isOrderDetails: PropTypes.bool,
};

CartItemsHeaderWide.defaultProps = {
  editable: true,
  isOrderDetails: false,
  isDirectShipOnly: false,
  hasLineItemPromotions: false,
};

export default connect(CartItemsHeaderWide);
