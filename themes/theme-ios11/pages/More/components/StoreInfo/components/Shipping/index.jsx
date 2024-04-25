import React, { Fragment } from 'react';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  NAV_MENU_SHIPPING_BEFORE,
  NAV_MENU_SHIPPING,
  NAV_MENU_SHIPPING_AFTER,
} from '@shopgate/pwa-common-commerce/market/constants/Portals';
import { SHIPPING_PATH } from '@shopgate/engage/page';
import portalProps from '../../../../portalProps';
import Item from '../../../Item';

/**
 * The ShippingComponent.
 * @returns {JSX}
 */
const Shipping = () => (
  <Fragment>
    <Portal name={NAV_MENU_SHIPPING_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_SHIPPING} props={portalProps}>
      <Item href={SHIPPING_PATH} label="navigation.shipping" />
    </Portal>
    <Portal name={NAV_MENU_SHIPPING_AFTER} props={portalProps} />
  </Fragment>
);

export default Shipping;
