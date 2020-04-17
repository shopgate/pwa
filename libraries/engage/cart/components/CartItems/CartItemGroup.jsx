// @flow
import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import CartItemGroupReservation from './CartItemGroupReservation';

type Props = {
  children: React.Node,
  fulfillmentLocationId?: string | null,
  multiLineReservation?: boolean,
  fulfillmentMethod?: string | null,
}

/**
 * Renders the product group.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
function CartItemGroup(props: Props) {
  const {
    multiLineReservation, fulfillmentLocationId, children, fulfillmentMethod,
  } = props;

  if (!multiLineReservation) {
    return children;
  }

  return (
    <React.Fragment>
      {!!fulfillmentLocationId && (
        <CartItemGroupReservation
          locationId={fulfillmentLocationId}
          fulfillmentMethod={fulfillmentMethod}
        />
      )}
      {children}
    </React.Fragment>
  );
}

CartItemGroup.defaultProps = {
  fulfillmentLocationId: null,
  multiLineReservation: false,
  fulfillmentMethod: null,
};

export default hot(CartItemGroup);
