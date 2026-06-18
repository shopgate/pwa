import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { LocationIcon, ResponsiveContainer, Typography } from '@shopgate/engage/components';
import { BOPIS, CartItemProductChangeLocation } from '@shopgate/engage/locations';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { useCartItem } from '../CartItem';
import CartItemCardReservationLabelChangeStore from './CartItemCardReservationLabelChangeStore';
/** @typedef {import('@shopgate/engage/locations/locations.types').LocationAware} LocationAware */

const useStyles = makeStyles()(theme => ({
  address: {
    display: 'flex',
    flexFlow: 'row nowrap',
  },
  addressIcon: {
    fontSize: theme.components.icon.small,
    marginRight: theme.spacing(2.5),
    flexShrink: 0,
    color: theme.palette.text.primary,
  },
  titles: {
    marginTop: -3,
    marginBottom: -2,
    paddingRight: theme.spacing(4),
  },
  name: {
    fontWeight: theme.typography.fontWeightMedium,
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      fontSize: theme.typography.h3.fontSize,
      lineHeight: '1.5rem',
    },
  },
  method: {
    color: theme.palette.grey.dark,
  },
}));

/**
 * Renders the cart reservation card label.
 * @param {LocationAware} props The component props.
 * @returns {JSX.Element|null}
 */
export function CartItemCardReservationLabel({ location, fulfillmentMethod }) {
  const { classes } = useStyles();
  const { cartItem, isEditable, registerFulfillmentAction } = useCartItem();

  if (!location) {
    return null;
  }

  const suffix = fulfillmentMethod === BOPIS ? 'bopis' : 'ropis';

  return (
    <div className={classes.address}>
      <div className={classes.addressIcon}>
        <LocationIcon />
      </div>
      <div className={classes.titles}>
        <Typography variant="body2" component="div" className={classes.name}>
          {location.name}
        </Typography>
        {isEditable && (
          <ResponsiveContainer webOnly breakpoint=">xs">
            <CartItemCardReservationLabelChangeStore />
            <CartItemProductChangeLocation
              cartItem={cartItem}
              registerAction={registerFulfillmentAction}
            />
          </ResponsiveContainer>
        )}

        <ResponsiveContainer appAlways breakpoint="<=xs">
          <Typography variant="caption" component="div" className={classes.method}>
            {i18n.text(`locations.method.${suffix}`)}
          </Typography>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

CartItemCardReservationLabel.propTypes = {
  fulfillmentMethod: PropTypes.string.isRequired,
  location: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default CartItemCardReservationLabel;
