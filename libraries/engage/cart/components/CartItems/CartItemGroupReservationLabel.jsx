// @flow
import React from 'react';
import { i18n } from '@shopgate/engage/core';
import { LocationIcon } from '@shopgate/engage/components';
import {
  type LocationAware,
  BOPIS,
} from '@shopgate/engage/locations';
import { address, addressIcon, title } from './CartItemGroup.style';

type Props = LocationAware;

/**
 * Renders the cart reservation group label.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export function CartItemGroupReservationLabel({ location, fulfillmentMethod }: Props) {
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
