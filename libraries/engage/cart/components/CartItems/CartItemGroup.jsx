import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import CartItemGroupShipping from './CartItemGroupShipping';
import CartItemGroupReservation from './CartItemGroupReservation';

/**
 * Renders the product group.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const CartItemGroup = ({ multiLineReservation, fulfillmentLocationId, children }) => {
  if (!multiLineReservation) {
    return children;
  }

  return (
    <Fragment>
      {fulfillmentLocationId &&
        <CartItemGroupReservation locationId={fulfillmentLocationId} />
      }
      {!fulfillmentLocationId &&
        <CartItemGroupShipping />
      }
      {children}
    </Fragment>
  );
};

CartItemGroup.propTypes = {
  children: PropTypes.node.isRequired,
  fulfillmentLocationId: PropTypes.string,
  multiLineReservation: PropTypes.bool,
};

CartItemGroup.defaultProps = {
  fulfillmentLocationId: null,
  multiLineReservation: false,
};

export default CartItemGroup;
