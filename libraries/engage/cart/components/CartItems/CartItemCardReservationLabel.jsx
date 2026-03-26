import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { LocationIcon, ResponsiveContainer } from '@shopgate/engage/components';
import { BOPIS, CartItemProductChangeLocation } from '@shopgate/engage/locations';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import { useCartItem } from '../CartItem';
import CartItemCardReservationLabelChangeStore from './CartItemCardReservationLabelChangeStore';
/** @typedef {import('@shopgate/engage/locations/locations.types').LocationAware} LocationAware */

const useStyles = makeStyles()(theme => ({
  address: {
    display: 'flex',
    flexFlow: 'row nowrap',
  },
  addressIcon: {
    fontSize: '1.25rem',
    marginRight: theme.spacing(2.5),
    flexShrink: 0,
    color: 'var(--color-text-heigh-emphasis)',
  },
  titles: {
    marginTop: -3,
    marginBottom: -2,
    paddingRight: theme.spacing(4),
  },
  name: {
    fontSize: '0.85rem',
    fontWeight: 500,
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      fontSize: '1.25rem',
      lineHeight: '1.5rem',
    },
  },
  method: {
    fontSize: '0.75rem',
    color: themeColors.shade11,
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
        <div className={classes.name}>
          {location.name}
        </div>
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
          <div className={classes.method}>
            {i18n.text(`locations.method.${suffix}`)}
          </div>
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
