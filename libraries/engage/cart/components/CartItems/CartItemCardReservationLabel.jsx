import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import { LocationIcon, ResponsiveContainer } from '@shopgate/engage/components';
import { BOPIS, CartItemProductChangeLocation } from '@shopgate/engage/locations';
import { useCartItem } from '../CartItem';
import CartItemCardReservationLabelChangeStore from './CartItemCardReservationLabelChangeStore';
import {
  address, addressIcon, titles, name, method,
} from './CartItemCard.style';
/** @typedef {import('@shopgate/engage/locations/locations.types').LocationAware} LocationAware */

/**
 * Renders the cart reservation card label.
 * @param {LocationAware} props The component props.
 * @returns {JSX.Element|null}
 */
export function CartItemCardReservationLabel({ location, fulfillmentMethod }) {
  const { cartItem, isEditable, registerFulfillmentAction } = useCartItem();

  if (!location) {
    return null;
  }

  const suffix = fulfillmentMethod === BOPIS ? 'bopis' : 'ropis';

  return (
    <div className={address}>
      <div className={addressIcon}>
        <LocationIcon />
      </div>
      <div className={titles}>
        <div className={name}>
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
          <div className={method}>
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
