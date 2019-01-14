import React, { Fragment } from 'react';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import Portal from '@shopgate/pwa-common/components/Portal';
import showReturnPolicy from '@shopgate/pwa-common-commerce/market/helpers/showReturnPolicy';
import {
  NAV_MENU_STORE_INFORMATION,
  NAV_MENU_STORE_INFORMATION_AFTER,
  NAV_MENU_STORE_INFORMATION_BEFORE,
} from '@shopgate/pwa-common/constants/Portals';
import ShippingButton from './components/ShippingButton';
import PaymentButton from './components/PaymentButton';
import TermsButton from './components/TermsButton';
import PrivacyButton from './components/PrivacyButton';
import ReturnsButton from './components/ReturnsButton';
import ImprintButton from './components/ImprintButton';
import portalProps from '../../portalProps';

/**
 * @returns {JSX}
 */
const StoreInfo = () => (
  <Fragment>
    <Portal name={NAV_MENU_STORE_INFORMATION_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_STORE_INFORMATION} props={portalProps}>
      <NavDrawer.Divider />
      <ShippingButton />
      <PaymentButton />
      <TermsButton />
      <PrivacyButton />
      {showReturnPolicy && <ReturnsButton />}
      <ImprintButton />
    </Portal>
    <Portal name={NAV_MENU_STORE_INFORMATION_AFTER} props={portalProps} />
  </Fragment>
);

export default StoreInfo;
