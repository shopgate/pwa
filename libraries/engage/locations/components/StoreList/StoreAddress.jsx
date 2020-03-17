// @flow
import React from 'react';
import { type LocationAddress } from '../../locations.types';
import { LocationIcon } from '../../../components';
import { i18n } from '../../../core';
import { address as container, addressIcon } from './Store.style';

type Props = {
  address?: LocationAddress,
};

/**
 * Renders the pickup location's address information.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export function StoreAddress({ address }: Props) {
  if (!address) {
    return null;
  }

  return (
    <div className={container}>
      <div className={addressIcon}>
        <LocationIcon />
      </div>
      <div>
        <div data-test-id="street">
          {address.street}
        </div>
        {(address.street2 && address.street2 !== '') && (
          <div data-test-id="street2">
            {address.street2}
          </div>
        )}
        {(address.street3 && address.street3 !== '') && (
          <div data-test-id="street3">
            {address.street3}
          </div>
        )}
        {(address.street4 && address.street4 !== '') && (
          <div data-test-id="street4">
            {address.street4}
          </div>
        )}
        {i18n.text('locations.address', address)}
      </div>
    </div>
  );
}

StoreAddress.defaultProps = {
  address: null,
};
