// @flow
import * as React from 'react';
import { i18n } from '@shopgate/engage/core';
import { LocationIcon, ResponsiveContainer } from '@shopgate/engage/components';
import {
  type LocationAware,
  BOPIS,
} from '@shopgate/engage/locations';
import {
  address, addressIcon, titles, name, method,
} from './CartItemCard.style';

type Props = LocationAware;

/**
 * Renders the cart reservation card label.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export function CartItemCardReservationLabel({ location, fulfillmentMethod }: Props) {
  if (!location) {
    return null;
  }

  const suffix = fulfillmentMethod === BOPIS ? 'bopis' : 'ropis';

  return (
    <div className={address}>
      <div className={addressIcon}>
        <LocationIcon />
      </div>
      <div className={titles}>
        <div className={name}>
          {location.name}
        </div>
        <ResponsiveContainer webOnly breakpoint="<=xs">
          <div className={method}>
            {i18n.text(`locations.method.${suffix}`)}
          </div>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
