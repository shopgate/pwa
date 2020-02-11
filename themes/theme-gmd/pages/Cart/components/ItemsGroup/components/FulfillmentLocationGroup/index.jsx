import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Accordion, LocationIcon } from '@shopgate/engage/components';
import CardListItem from '@shopgate/pwa-ui-shared/CardList/components/Item';
import { i18n } from '@shopgate/engage/core/helpers/i18n';
import { StoreAddressOpeningHours, StoreAddressPhoneNumber } from '@shopgate/engage/locations';
import connect from './connector';
import {
  address, addressIcon, title, accordionToggle, addressDetails,
} from './style';

/**
 * Renders the product group.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const FulfillmentLocationGroup = ({ location }) => (
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

FulfillmentLocationGroup.propTypes = {
  location: PropTypes.shape(),
};

FulfillmentLocationGroup.defaultProps = {
  location: null,
};

export default connect(FulfillmentLocationGroup);
