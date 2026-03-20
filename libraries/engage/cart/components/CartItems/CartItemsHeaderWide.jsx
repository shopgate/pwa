import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { I18n } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import connect from './CartItemsHeaderWide.connector';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 500,
    fontSize: '1rem',
    lineHeight: '1.5rem',
    padding: `0 ${variables.gap.big}px ${variables.gap.small}px ${variables.gap.big}px`,
  },
  column: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    flexShrink: 0,
    flexGrow: 1,
    flexBasis: 0,
    padding: `0 ${variables.gap.small}px`,
    textAlign: 'center',
    ':last-child': {
      paddingRight: variables.gap.small,
    },
  },
  priceColumnWide: {
    flexGrow: 4,
    alignItems: 'flex-end',
  },
  imageColumn: {
    flexGrow: 0,
    width: 120,
    margin: `0 ${variables.gap.small}px 0 ${variables.gap.big}px`,
    paddingLeft: 0,
  },
  detailsColumn: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    flexShrink: 1,
    flexGrow: 3,
    flexBasis: 0,
    padding: `0 ${variables.gap.small}px`,
    textAlign: 'center',
  },
  locationColumn: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    flexShrink: 0,
    flexGrow: 2,
    flexBasis: 0,
    padding: `0 ${variables.gap.small}px`,
    textAlign: 'center',
    ':last-child': {
      paddingRight: variables.gap.small,
    },
  },
  quantityPickerColumn: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    flexShrink: 0,
    flexGrow: 1,
    flexBasis: 0,
    padding: `0 ${variables.gap.small}px`,
    textAlign: 'center',
    ':last-child': {
      paddingRight: variables.gap.small,
    },
    ' > *': {
      width: 140,
      textAlign: 'center',
    },
  },
  quantityPickerColumnNotEditable: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    flexShrink: 0,
    flexGrow: 1,
    flexBasis: 0,
    padding: `0 ${variables.gap.small}px`,
    textAlign: 'center',
    ':last-child': {
      paddingRight: variables.gap.small,
    },
    ' > *': {
      textAlign: 'center',
    },
  },
  contextMenuColumn: {
    width: variables.gap.xbig + variables.gap.small,
  },
});

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
}) => {
  const { classes } = useStyles();

  return (
    <div className={classes.header}>
      <div className={classes.imageColumn}>
        <I18n.Text string="cart.items" />
      </div>
      <div className={classes.detailsColumn} />
      <div className={classNames(classes.column, {
        [classes.priceColumnWide]: hasLineItemPromotions,
      })}
      >
        <I18n.Text string="cart.price" />
      </div>
      {isOrderDetails && (
      <>
        {!isDirectShipOnly ? (
          <div className={classes.locationColumn}>
            <I18n.Text string="cart.location" />
          </div>
        ) : null}
        <div className={classes.column}>
          <I18n.Text string="cart.status" />
        </div>
        <div className={classes.column}>
          <I18n.Text string="cart.fulfilled_quantity" />
        </div>
      </>
      )}
      <div className={editable
        ? classes.quantityPickerColumn
        : classes.quantityPickerColumnNotEditable}
      >
        <I18n.Text string={isOrderDetails ? 'cart.ordered_quantity' : 'cart.quantity'} />
      </div>
      <div className={classes.column}>
        <I18n.Text string="cart.subtotal" />
      </div>
      { editable && enabledFulfillmentMethodsCount > 1 && (
      <div className={classes.contextMenuColumn} />
      )}
    </div>
  );
};

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
