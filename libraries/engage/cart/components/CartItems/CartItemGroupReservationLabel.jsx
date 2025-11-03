import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import { LocationIcon } from '@shopgate/engage/components';
import { BOPIS } from '@shopgate/engage/locations';
import { address, addressIcon, title } from './CartItemGroup.style';
/** @typedef {import('@shopgate/engage/locations/locations.types').LocationAware} LocationAware */

/**
 * Renders the cart reservation group label.
 * @param {LocationAware} props The component props.
 * @returns {JSX.Element|null}
 */
export function CartItemGroupReservationLabel({ location, fulfillmentMethod }) {
  if (!location) {
    return null;
  }

  const suffix = fulfillmentMethod === BOPIS ? 'bopis' : 'ropis';

  return (
    <div className={address}>
      <div className={addressIcon}>
        <LocationIcon />
      </div>
      <div>
        <div className={title}>
          {i18n.text(`locations.method.${suffix}`)}
        </div>
        {location.name}
      </div>
    </div>
  );
}

CartItemGroupReservationLabel.propTypes = {
  fulfillmentMethod: PropTypes.string.isRequired,
  location: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default CartItemGroupReservationLabel;
