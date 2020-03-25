// @flow
import * as React from 'react';
import { i18n } from '@shopgate/engage/core';
import { LocationIcon } from '@shopgate/engage/components';
import { type LocationAware } from '@shopgate/engage/locations';
import {
  address, addressIcon, titles, name, method,
} from './CartItemCard.style';

type Props = LocationAware;

/**
 * Renders the cart reservation card label.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export function CartItemCardReservationLabel({ location }: Props) {
  if (!location) {
    return null;
  }

  return (
    <div className={address}>
      <div className={addressIcon}>
        <LocationIcon />
      </div>
      <div className={titles}>
        <div className={name}>
          {location.name}
        </div>
        <div className={method}>
          {i18n.text('locations.method.ropis')}
        </div>
      </div>
    </div>
  );
}
