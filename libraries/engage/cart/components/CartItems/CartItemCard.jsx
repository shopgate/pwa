// @flow
import * as React from 'react';
import CartItemCardReservation from './CartItemCardReservation';
import { withBorder } from './CartItemCard.style';

type Props = {
  children: React.Node,
  fulfillmentLocationId?: string | null,
  multiLineReservation?: boolean,
  fulfillmentMethod?: string | null,
}

/**
 * Renders the cart items.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export function CartItemCard(props: Props) {
  const {
    multiLineReservation, fulfillmentLocationId, children, fulfillmentMethod,
  } = props;

  if (!multiLineReservation) {
    return children;
  }

  return (
    <React.Fragment>
      <ul className={fulfillmentLocationId ? withBorder : null}>
        {children}
      </ul>
      {!!fulfillmentLocationId && (
        <CartItemCardReservation
          locationId={fulfillmentLocationId}
          fulfillmentMethod={fulfillmentMethod}
        />
      )}
    </React.Fragment>
  );
}

CartItemCard.defaultProps = {
  fulfillmentLocationId: null,
  multiLineReservation: false,
  fulfillmentMethod: null,
};
