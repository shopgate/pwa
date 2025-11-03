import React from 'react';
import PropTypes from 'prop-types';
import { every, isEmpty } from 'lodash';
import CardListItem from '@shopgate/pwa-ui-shared/CardList/components/Item';
import { Accordion } from '@shopgate/engage/components';
import { StoreOpeningHours, StorePhoneNumber } from '@shopgate/engage/locations';
import { CartItemGroupReservationLabel } from './CartItemGroupReservationLabel';
import connect from './CartItem.connector';
import { accordionToggle, addressDetails, simpleLabel } from './CartItemGroup.style';

// eslint-disable-next-line max-len
/** @typedef {import('@shopgate/engage/locations/locations.types').OptionalLocationAware} OptionalLocationAware */

/**
 * Renders the product group.
 * @param {OptionalLocationAware} props The component props.
 * @returns {JSX.Element|null}
 */
function CartItemGroupReservation({ location, fulfillmentMethod }) {
  if (!location) {
    return null;
  }

  const { operationHours, address: { phoneNumber } = {} } = location;
  if ((!operationHours || every(operationHours, isEmpty)) && !phoneNumber) {
    return (
      <CardListItem className={simpleLabel.toString()}>
        <CartItemGroupReservationLabel location={location} fulfillmentMethod={fulfillmentMethod} />
      </CardListItem>
    );
  }

  return (
    <CardListItem>
      <Accordion
        renderLabel={() =>
          <CartItemGroupReservationLabel
            location={location}
            fulfillmentMethod={fulfillmentMethod}
          />
        }
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

CartItemGroupReservation.propTypes = {
  fulfillmentMethod: PropTypes.string,
  location: PropTypes.shape({
    operationHours: PropTypes.object,
    address: PropTypes.shape({
      phoneNumber: PropTypes.string,
    }),
  }),
};

CartItemGroupReservation.defaultProps = {
  location: null,
  fulfillmentMethod: null,
};

export default connect(CartItemGroupReservation);
