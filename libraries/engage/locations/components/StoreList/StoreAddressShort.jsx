import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { i18n, generateGoogleMapsDirectionsUrl } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import {
  LocationIcon, Link, Ellipsis, I18n,
} from '@shopgate/engage/components';
import { StoreDetailsLine } from './StoreDetailsLine';

const useStyles = makeStyles()({
  detailsPrimary: {
    margin: 0,
    color: 'var(--color-primary)',
    lineHeight: '1.375rem',
  },
  detailsSecondary: {
    color: 'var(--color-text-medium-emphasis)',
    fontSize: '0.75rem',
  },
});

/**
 * Renders the pickup location's address information.
 * @param {Object} props The component props.
 * @param {Object} props.address The address object.
 * @param {boolean} props.showFull Whether to show the full address.
 * @returns {JSX.Element}
 */
export function StoreAddressShort({ address, showFull }) {
  const { classes } = useStyles();
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
          <>
            <p className={classes.detailsPrimary}>
              {address.street}
            </p>
            {(address.street2 && address.street2 !== '') && (
              <p className={classes.detailsPrimary}>
                {address.street2}
              </p>
            )}
            {(address.street3 && address.street3 !== '') && (
              <p className={classes.detailsPrimary}>
                {address.street3}
              </p>
            )}
            {(address.street4 && address.street4 !== '') && (
              <p className={classes.detailsPrimary}>
                {address.street4}
              </p>
            )}
          </>
        )}

        <Ellipsis rows={1} className={classes.detailsPrimary}>
          {i18n.text('locations.address', address)}
        </Ellipsis>
        <I18n.Text
          string="locations.map_open"
          className={classes.detailsSecondary}
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
