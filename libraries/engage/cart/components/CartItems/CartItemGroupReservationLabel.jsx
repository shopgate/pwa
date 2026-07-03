import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { LocationIcon, Typography } from '@shopgate/engage/components';
import { BOPIS } from '@shopgate/engage/locations';
import { makeStyles } from '@shopgate/engage/styles';
/** @typedef {import('@shopgate/engage/locations/locations.types').LocationAware} LocationAware */

const useStyles = makeStyles()(theme => ({
  address: {
    display: 'flex',
    flexFlow: 'row nowrap',
  },
  addressIcon: {
    fontSize: theme.components.icon.small,
    padding: theme.spacing(1, 1, 0, 0),
    flexShrink: 0,
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
        <Typography variant="body2" component="div" fontWeight="bold">
          {i18n.text(`locations.method.${suffix}`)}
        </Typography>
        <Typography variant="body2" component="div">{location.name}</Typography>
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
