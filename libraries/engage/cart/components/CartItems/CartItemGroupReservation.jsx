// @flow
import React from 'react';
import { every, isEmpty } from 'lodash';
import CardListItem from '@shopgate/pwa-ui-shared/CardList/components/Item';
import { Accordion } from '@shopgate/engage/components';
import { StoreOpeningHours, StorePhoneNumber } from '@shopgate/engage/locations';
import { type OptionalLocationAware } from '@shopgate/engage/locations/locations.types';
import { CartItemGroupReservationLabel } from './CartItemGroupReservationLabel';
import connect from './CartItemGroupReservation.connector';
import { accordionToggle, addressDetails, simpleLabel } from './CartItemGroup.style';

type Props = OptionalLocationAware;

/**
 * Renders the product group.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
function CartItemGroupReservation({ location }: Props) {
  if (!location) {
    return null;
  }

  const { operationHours, address: { phoneNumber } = {} } = location;
  if ((!operationHours || every(operationHours, isEmpty)) && !phoneNumber) {
    return (
      <CardListItem className={simpleLabel.toString()}>
        <CartItemGroupReservationLabel location={location} />
      </CardListItem>
    );
  }

  return (
    <CardListItem>
      <Accordion
        renderLabel={() => <CartItemGroupReservationLabel location={location} />}
        className={accordionToggle}
      >
        <div className={addressDetails}>
          <StoreOpeningHours hours={operationHours} />
          <StorePhoneNumber phone={phoneNumber} />
        </div>
      </Accordion>
    </CardListItem>
  );
}

CartItemGroupReservation.defaultProps = {
  location: null,
};

export default connect<Props>(CartItemGroupReservation);
