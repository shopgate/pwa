import React, { Fragment } from 'react';
import CardListItem from '@shopgate/pwa-ui-shared/CardList/components/Item';
import { LocalShippingIcon } from '../../../components';
import { i18n } from '../../../core';
import { address, shippingIcon, shippingTitle } from './CartItemGroup.style';

/**
 * Renders the cart item group.
 * @returns {JSX.Element}
 */
const CartItemGroupShipping = () => (
  <Fragment>
    <CardListItem>
      <div className={address}>
        <div className={shippingIcon}>
          <LocalShippingIcon />
        </div>
        <div>
          <div className={shippingTitle}>
            {i18n.text('locations.method.direct_ship')}
          </div>
        </div>
      </div>
    </CardListItem>
  </Fragment>
);

export default CartItemGroupShipping;
