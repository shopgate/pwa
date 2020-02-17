import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import CardListItem from '@shopgate/pwa-ui-shared/CardList/components/Item';
import { Accordion, LocationIcon } from '../../../components';
import { i18n } from '../../../core';
import { StoreAddressOpeningHours, StoreAddressPhoneNumber } from '../../../locations';
import connect from './CartItemGroupReservation.connector';
import {
  address, addressIcon, title, accordionToggle, addressDetails,
} from './CartItemGroup.style';

/**
 * Renders the product group.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const FulfillmentLocation = ({ location }) => (
  <Fragment>
    {location && (
    <CardListItem>
      <Accordion
        renderLabel={() => (
          <div className={address}>
            <div className={addressIcon}>
              <LocationIcon />
            </div>
            <div>
              <div className={title}>
                {i18n.text('locations.method.ropis')}
              </div>
              {`${location.address.street}, ${location.address.city}`}
            </div>
          </div>
        )}
        className={accordionToggle}
      >
        <div className={addressDetails}>
          <StoreAddressOpeningHours hours={location.operationHours} />
          <StoreAddressPhoneNumber phone={address.phoneNumber} />
        </div>
      </Accordion>
    </CardListItem>
    )}
  </Fragment>
);

FulfillmentLocation.propTypes = {
  location: PropTypes.shape(),
};

FulfillmentLocation.defaultProps = {
  location: null,
};

export default connect(FulfillmentLocation);
