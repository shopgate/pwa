// @flow
import * as React from 'react';
import { every, isEmpty } from 'lodash';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { type OptionalLocationAware } from '@shopgate/engage/locations';
import { useCartItem } from '../CartItem';
import { CartItemCardReservationLabel } from './CartItemCardReservationLabel';
import connect from './CartItem.connector';
import { CartItemCardReservationAccordion } from './CartItemCardReservationAccordion';
import {
  accordionToggle,
} from './CartItemCard.style';

type Props = OptionalLocationAware;

/**
 * Renders the cart item card reservation block,
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
function CartItemCardReservation({ location, fulfillmentMethod }: Props) {
  const { isOrderDetails } = useCartItem();

  if (!location) {
    return null;
  }

  const { operationHours, address: { phoneNumber } = {} } = location;
  if (
    (!operationHours || every(operationHours, isEmpty))
    && !phoneNumber
    && (!location.address || !location.address.street)
  ) {
    return (
      <div className={accordionToggle}>
        <CartItemCardReservationLabel location={location} fulfillmentMethod={fulfillmentMethod} />
      </div>
    );
  }

  return (
    <React.Fragment>
      <ResponsiveContainer webOnly breakpoint=">xs">
        { !isOrderDetails && (
          <CartItemCardReservationAccordion
            openWithChevron
            location={location}
            fulfillmentMethod={fulfillmentMethod}
            operationHours={operationHours}
          />
        )}
      </ResponsiveContainer>
      <ResponsiveContainer appAlways breakpoint="<=xs">
        { !isOrderDetails && (
          <CartItemCardReservationAccordion
            location={location}
            fulfillmentMethod={fulfillmentMethod}
            operationHours={operationHours}
          />
        )}
      </ResponsiveContainer>

    </React.Fragment>

  );
}

export default connect<Props>(CartItemCardReservation);
