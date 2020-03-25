// @flow
import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import CartItemGroupReservation from './CartItemGroupReservation';

type Props = {
  children: React.Node,
  fulfillmentLocationId?: string | null,
  multiLineReservation?: boolean,
}

/**
 * Renders the product group.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
function CartItemGroup(props: Props) {
  const { multiLineReservation, fulfillmentLocationId, children } = props;

  if (!multiLineReservation) {
    return children;
  }

  return (
    <React.Fragment>
      {!!fulfillmentLocationId && (
        <CartItemGroupReservation locationId={fulfillmentLocationId} />
      )}
      {children}
    </React.Fragment>
  );
}

CartItemGroup.defaultProps = {
  fulfillmentLocationId: null,
  multiLineReservation: false,
};

export default hot(CartItemGroup);
