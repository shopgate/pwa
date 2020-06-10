import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { i18n, generateGoogleMapsDirectionsUrl } from '@shopgate/engage/core';
import { CheckoutConfirmationSection } from '../../../checkout/components';
import connect from './OrderDetailsOrderPickupLocation.connector';
import { locationName } from './OrderDetailsOrderPickupLocation.style';

/**
 * OrderDetailsPickupLocation component
 * @returns {JSX}
 */
const OrderDetailsPickupLocation = ({ location, className }) => {
  const content = useMemo(() => {
    if (!location) {
      return null;
    }

    const { name, address } = location;
    const mapsUrl = generateGoogleMapsDirectionsUrl(address);
    const entries = [{
      text: `<h4 class="${locationName}">${name}</h4>`,
    }];

    const formattedAddress = [
      address?.street,
      address?.street2,
      i18n.text('locations.address', {
        postalCode: address.postalCode,
        city: address.city,
        region: address.region,
      }),
    ].filter(Boolean).join('\n');

    entries.push({
      label: 'order_details.pickup_location.address',
      text: formattedAddress,
      link: mapsUrl,
    });

    if (address.phoneNumber) {
      entries.push({
        label: 'order_details.pickup_location.phone_number',
        text: address.phoneNumber,
        link: `tel:${address.phoneNumber}`,
      });
    }

    return entries;
  }, [location]);

  if (!location) {
    return null;
  }

  return (
    <CheckoutConfirmationSection
      title="order_details.pickup_location.headline"
      content={content}
      className={className}
    />
  );
};

OrderDetailsPickupLocation.propTypes = {
  className: PropTypes.string,
  location: PropTypes.shape(),
};

OrderDetailsPickupLocation.defaultProps = {
  className: null,
  location: null,
};

export default connect(OrderDetailsPickupLocation);
