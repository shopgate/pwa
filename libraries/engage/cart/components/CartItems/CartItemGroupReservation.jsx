import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { every, isEmpty } from 'lodash';
import CardListItem from '@shopgate/pwa-ui-shared/CardList/components/Item';
import { Accordion, LocationIcon } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import { StoreAddressOpeningHours, StoreAddressPhoneNumber } from '@shopgate/engage/locations';
import connect from './CartItemGroupReservation.connector';
import {
  address, addressIcon, title, accordionToggle, addressDetails, simpleLabel,
} from './CartItemGroup.style';

/**
 * Renders the product group.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const FulfillmentLocation = ({ location }) => {
  const label = useMemo(() => {
    if (!location) {
      return null;
    }
    return (
      <div className={address}>
        <div className={addressIcon}>
          <LocationIcon />
        </div>
        <div>
          <div className={title}>
            {i18n.text('locations.method.ropis')}
          </div>
          {location.name}
        </div>
      </div>
    );
  }, [location]);

  if (!location) {
    return null;
  }

  const { operationHours, address: { phoneNumber } = {} } = location;

  if ((!operationHours || every(operationHours, isEmpty)) && !phoneNumber) {
    return (
      <CardListItem className={simpleLabel.toString()}>{label}</CardListItem>
    );
  }

  return (
    <CardListItem>
      <Accordion renderLabel={() => label} className={accordionToggle}>
        <div className={addressDetails}>
          <StoreAddressOpeningHours hours={operationHours} />
          <StoreAddressPhoneNumber phone={phoneNumber} />
        </div>
      </Accordion>
    </CardListItem>
  );
};

FulfillmentLocation.propTypes = {
  location: PropTypes.shape(),
};

FulfillmentLocation.defaultProps = {
  location: null,
};

export default connect(FulfillmentLocation);
