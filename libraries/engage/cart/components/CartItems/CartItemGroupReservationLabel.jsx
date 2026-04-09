import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { LocationIcon } from '@shopgate/engage/components';
import { BOPIS } from '@shopgate/engage/locations';
import { makeStyles } from '@shopgate/engage/styles';
/** @typedef {import('@shopgate/engage/locations/locations.types').LocationAware} LocationAware */

const useStyles = makeStyles()(theme => ({
  address: {
    display: 'flex',
    flexFlow: 'row nowrap',
    fontSize: '0.875rem',
  },
  addressIcon: {
    fontSize: '1.25rem',
    padding: theme.spacing(1, 1, 0, 0),
    flexShrink: 0,
  },
  title: {
    fontWeight: 600,
  },
}));

/**
 * Renders the cart reservation group label.
 * @param {LocationAware} props The component props.
 * @returns {JSX.Element|null}
 */
export function CartItemGroupReservationLabel({ location, fulfillmentMethod }) {
  const { classes } = useStyles();
  if (!location) {
    return null;
  }

  const suffix = fulfillmentMethod === BOPIS ? 'bopis' : 'ropis';

  return (
    <div className={classes.address}>
      <div className={classes.addressIcon}>
        <LocationIcon />
      </div>
      <div>
        <div className={classes.title}>
          {i18n.text(`locations.method.${suffix}`)}
        </div>
        {location.name}
      </div>
    </div>
  );
}

CartItemGroupReservationLabel.propTypes = {
  fulfillmentMethod: PropTypes.string.isRequired,
  location: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default CartItemGroupReservationLabel;
