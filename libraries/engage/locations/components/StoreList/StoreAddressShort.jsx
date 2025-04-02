import React, { Fragment, useMemo } from 'react';
import { i18n, generateGoogleMapsDirectionsUrl } from '@shopgate/engage/core';
import {
  LocationIcon, Link, Ellipsis, I18n,
} from '@shopgate/engage//components';
import PropTypes from 'prop-types';
import { StoreDetailsLine } from './StoreDetailsLine';
import { detailsPrimary, detailsSecondary } from './Store.style';

/**
 * Renders the pickup location's address information.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export function StoreAddressShort({ address, showFull }) {
  const mapsUrl = useMemo(() => address && generateGoogleMapsDirectionsUrl(address), [address]);

  if (!address) {
    return null;
  }

  return (
    <Link target="_blank" href={mapsUrl} role="button">
      <StoreDetailsLine icon={LocationIcon} linked>
        { showFull && (
          <Fragment>
            <p className={detailsPrimary}>
              {address.street}
            </p>
            {(address.street2 && address.street2 !== '') && (
              <p className={detailsPrimary}>
                {address.street2}
              </p>
            )}
            {(address.street3 && address.street3 !== '') && (
              <p className={detailsPrimary}>
                {address.street3}
              </p>
            )}
            {(address.street4 && address.street4 !== '') && (
              <p className={detailsPrimary}>
                {address.street4}
              </p>
            )}
          </Fragment>
        )}

        <Ellipsis rows={1} className={detailsPrimary}>
          {i18n.text('locations.address', address)}
        </Ellipsis>
        <I18n.Text
          string="locations.map_open"
          className={detailsSecondary}
          aria-label={`: ${i18n.text('locations.map_open')}`}
        />
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
