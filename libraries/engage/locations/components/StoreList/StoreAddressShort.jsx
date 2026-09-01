import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { i18n, generateGoogleMapsDirectionsUrl } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import {
  LocationIcon, Link, Ellipsis, Typography,
} from '@shopgate/engage/components';
import { StoreDetailsLine } from './StoreDetailsLine';

const useStyles = makeStyles()(theme => ({
  detailsPrimary: {
    margin: 0,
    color: theme.palette.primary.main,
    lineHeight: '1.375rem',
  },
}));

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
        <Typography
          variant="caption"
          component="span"
          color="textSecondary"
          aria-label={`: ${i18n.text('locations.map_open')}`}
        >
          {i18n.text('locations.map_open')}
        </Typography>
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
