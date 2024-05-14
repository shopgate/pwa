import React, { Fragment } from 'react';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  NAV_MENU_PAYMENT_BEFORE,
  NAV_MENU_PAYMENT,
  NAV_MENU_PAYMENT_AFTER,
} from '@shopgate/pwa-common-commerce/market/constants/Portals';
import { PAYMENT_PATH } from '@shopgate/engage/page/constants';
import portalProps from '../../../../portalProps';
import Item from '../../../Item';

/**
 * The PaymentComponent.
 * @returns {JSX.Element}
 */
const Payment = () => (
  <Fragment>
    <Portal name={NAV_MENU_PAYMENT_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_PAYMENT} props={portalProps}>
      <Item href={PAYMENT_PATH} label="navigation.payment" />
    </Portal>
    <Portal name={NAV_MENU_PAYMENT_AFTER} props={portalProps} />
  </Fragment>
);

export default Payment;
