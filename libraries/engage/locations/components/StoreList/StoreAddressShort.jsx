// @flow
import React, { Fragment, useMemo } from 'react';
import { i18n, generateGoogleMapsDirectionsUrl } from '@shopgate/engage/core';
import {
  LocationIcon, Link, Ellipsis, I18n,
} from '@shopgate/engage//components';
import { StoreDetailsLine } from './StoreDetailsLine';
import { type LocationAddress } from '../../locations.types';
import { detailsPrimary, detailsSecondary } from './Store.style';

type Props = {
  address?: LocationAddress,
  showFull?: boolean,
};

/**
 * Renders the pickup location's address information.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export function StoreAddressShort({ address, showFull }: Props) {
  const mapsUrl = useMemo(() => address && generateGoogleMapsDirectionsUrl(address), [address]);

  if (!address) {
    return null;
  }

  return (
    <Link target="_blank" href={mapsUrl}>
      <StoreDetailsLine icon={LocationIcon} linked>
        { showFull && (
          <Fragment>
            <div className={detailsPrimary}>
              {address.street}
            </div>
            {(address.street2 && address.street2 !== '') && (
              <div className={detailsPrimary}>
                {address.street2}
              </div>
            )}
            {(address.street3 && address.street3 !== '') && (
              <div className={detailsPrimary}>
                {address.street3}
              </div>
            )}
            {(address.street4 && address.street4 !== '') && (
              <div className={detailsPrimary}>
                {address.street4}
              </div>
            )}
          </Fragment>
        )}

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
  showFull: false,
};
