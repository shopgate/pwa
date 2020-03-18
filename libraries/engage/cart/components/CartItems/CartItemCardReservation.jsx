// @flow
import * as React from 'react';
import { every, isEmpty } from 'lodash';
import { Accordion } from '@shopgate/engage/components';
import { type OptionalLocationAware, StoreAddress, StoreOpeningHours } from '@shopgate/engage/locations';
import { CartItemCardReservationLabel } from './CartItemCardReservationLabel';
import connect from './CartItem.connector';
import {
  accordionToggle, accordianContent, locationAdress, locationHours,
} from './CartItemCard.style';

type Props = OptionalLocationAware;

/**
 * Renders the cart item card reservation block,
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
function CartItemCardReservation({ location }: Props) {
  if (!location) {
    return null;
  }

  const { operationHours, address: { phoneNumber } = {} } = location;
  if ((!operationHours || every(operationHours, isEmpty)) && !phoneNumber) {
    return <CartItemCardReservationLabel location={location} />;
  }

  return (
    <Accordion
      className={accordionToggle}
      renderLabel={() => <CartItemCardReservationLabel location={location} />}
    >
      <div className={accordianContent}>
        <div className={locationAdress}>
          <StoreAddress address={location.address} pure />
        </div>
        {operationHours && (
          <div className={locationHours}>
            <StoreOpeningHours hours={operationHours} pure />
          </div>
        )}
      </div>
    </Accordion>
  );
}

export default connect<Props>(CartItemCardReservation);
