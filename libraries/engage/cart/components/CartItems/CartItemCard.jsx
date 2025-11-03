import React from 'react';
import PropTypes from 'prop-types';
import CartItemCardReservation from './CartItemCardReservation';
import { withBorder } from './CartItemCard.style';

/**
 * Renders the cart items.
 * @param {Object} props The component props.
 * @param {React.ReactNode} props.children The child components.
 * @param {string|null} [props.fulfillmentLocationId] The fulfillment location ID.
 * @param {boolean} [props.multiLineReservation=false] Whether multi-line reservation is enabled.
 * @param {string|null} [props.fulfillmentMethod] The fulfillment method.
 * @param {boolean} [props.hasMessages=false] Whether the cart item has messages.
 * @returns {JSX.Element} The rendered component.
 */
export const CartItemCard = ({
  children,
  fulfillmentLocationId,
  multiLineReservation,
  fulfillmentMethod,
  hasMessages,
}) => {
  if (!multiLineReservation) {
    return children;
  }

  return (
    <>
      <ul className={fulfillmentLocationId && !hasMessages ? withBorder : null}>
        {children}
      </ul>
      {!!fulfillmentLocationId && (
        <CartItemCardReservation
          locationId={fulfillmentLocationId}
          fulfillmentMethod={fulfillmentMethod}
        />
      )}
    </>
  );
};

CartItemCard.propTypes = {
  children: PropTypes.node.isRequired,
  fulfillmentLocationId: PropTypes.string,
  fulfillmentMethod: PropTypes.string,
  hasMessages: PropTypes.bool,
  multiLineReservation: PropTypes.bool,
};

CartItemCard.defaultProps = {
  fulfillmentLocationId: null,
  multiLineReservation: false,
  fulfillmentMethod: null,
  hasMessages: false,
};
