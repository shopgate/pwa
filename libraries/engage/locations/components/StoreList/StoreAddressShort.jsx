import React, { Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import { i18n, generateGoogleMapsDirectionsUrl } from '@shopgate/engage/core';
import {
  LocationIcon, Link, Ellipsis, I18n,
} from '@shopgate/engage/components';
import { StoreDetailsLine } from './StoreDetailsLine';
import { detailsPrimary, detailsSecondary } from './Store.style';

/**
 * Renders the pickup location's address information.
 * @param {Object} props The component props.
 * @param {Object} props.address The address object.
 * @param {boolean} props.showFull Whether to show the full address.
 * @returns {JSX.Element}
 */
export function StoreAddressShort({ address, showFull }) {
  const mapsUrl = useMemo(() => address && generateGoogleMapsDirectionsUrl(address), [address]);

  if (!address) {
    return null;
  }

  const addressLabel = `${address.street
  + (address.street2 ? `, ${address.street2}` : '')
  + (address.street3 ? `, ${address.street3}` : '')
  + (address.street4 ? `, ${address.street4}` : '')
  + i18n.text('locations.address', address)}: ${i18n.text('locations.map_open')}`;

  return (
    <Link
      target="_blank"
      href={mapsUrl}
      role="button"
      aria-label={addressLabel}
    >
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

StoreAddressShort.propTypes = {
  address: PropTypes.shape(),
  showFull: PropTypes.bool,
};

StoreAddressShort.defaultProps = {
  address: null,
  showFull: false,
};
