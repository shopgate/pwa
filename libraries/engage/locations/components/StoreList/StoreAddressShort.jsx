// @flow
import React, { useMemo } from 'react';
import { i18n, generateGoogleMapsDirectionsUrl } from '@shopgate/engage/core';
import {
  LocationIcon, Link, Ellipsis, I18n,
} from '@shopgate/engage//components';
import { StoreDetailsLine } from './StoreDetailsLine';
import { type LocationAddress } from '../../locations.types';
import { detailsPrimary, detailsSecondary } from './Store.style';

type Props = {
  address?: LocationAddress
};

/**
 * Renders the pickup location's address information.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export function StoreAddressShort({ address }: Props) {
  const mapsUrl = useMemo(() => address && generateGoogleMapsDirectionsUrl(address), [address]);

  if (!address) {
    return null;
  }

  return (
    <Link target="_blank" href={mapsUrl}>
      <StoreDetailsLine icon={LocationIcon}>
        <Ellipsis rows={1} className={detailsPrimary}>
          {i18n.text('locations.address', address)}
        </Ellipsis>
        <I18n.Text string="locations.map_open" className={detailsSecondary} />
      </StoreDetailsLine>
    </Link>
  );
}

StoreAddressShort.defaultProps = {
  address: null,
};
