import React from 'react';
import PropTypes from 'prop-types';
import { every, isEmpty } from 'lodash';
import CardListItem from '@shopgate/pwa-ui-shared/CardList/components/Item';
import { Accordion } from '@shopgate/engage/components';
import { StoreAddressOpeningHours, StoreAddressPhoneNumber } from '@shopgate/engage/locations';
import connect from './CartItemGroupReservation.connector';
import { accordionToggle, addressDetails, simpleLabel } from './CartItemGroup.style';
import { CartItemGroupReservationLabel } from './CartItemGroupReservationLabel';

/**
 * Renders the product group.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
function CartItemGroupReservation({ location }) {
  if (!location) {
    return null;
  }

  const { operationHours, address: { phoneNumber } = {} } = location;

  if ((!operationHours || every(operationHours, isEmpty)) && !phoneNumber) {
    return (
      <CardListItem className={simpleLabel.toString()}>
        <CartItemGroupReservationLabel loction={location} />
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
          <StoreAddressOpeningHours hours={operationHours} />
          <StoreAddressPhoneNumber phone={phoneNumber} />
        </div>
      </Accordion>
    </CardListItem>
  );
}

CartItemGroupReservation.propTypes = {
  location: PropTypes.shape(),
};

CartItemGroupReservation.defaultProps = {
  location: null,
};

export default connect(CartItemGroupReservation);
