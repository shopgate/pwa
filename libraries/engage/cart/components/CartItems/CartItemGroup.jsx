import React from 'react';
import PropTypes from 'prop-types';
import CartItemGroupReservation from './CartItemGroupReservation';

/**
 * Renders the product group.
 * @param {Object} props The component props.
 * @param {React.ReactNode} props.children The child components.
 * @param {string|null} [props.fulfillmentLocationId] The fulfillment location ID.
 * @param {boolean} [props.multiLineReservation=false] Whether multi-line reservation is enabled.
 * @param {string|null} [props.fulfillmentMethod] The fulfillment method.
 * @returns {JSX.Element} The rendered component.
 */
const CartItemGroup = ({
  children,
  fulfillmentLocationId,
  multiLineReservation,
  fulfillmentMethod,
}) => {
  if (!multiLineReservation) {
    return children;
  }

  return (
    <>
      {!!fulfillmentLocationId && (
        <CartItemGroupReservation
          locationId={fulfillmentLocationId}
          fulfillmentMethod={fulfillmentMethod}
        />
      )}
      {children}
    </>
  );
};

CartItemGroup.propTypes = {
  children: PropTypes.node.isRequired,
  fulfillmentLocationId: PropTypes.string,
  fulfillmentMethod: PropTypes.string,
  multiLineReservation: PropTypes.bool,
};

CartItemGroup.defaultProps = {
  fulfillmentLocationId: null,
  multiLineReservation: false,
  fulfillmentMethod: null,
};

export default CartItemGroup;
