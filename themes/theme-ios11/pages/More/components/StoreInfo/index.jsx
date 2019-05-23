import React, { Fragment } from 'react';
import { Portal } from '@shopgate/engage/components';
import {
  NAV_MENU_STORE_INFORMATION_BEFORE,
  NAV_MENU_STORE_INFORMATION,
  NAV_MENU_STORE_INFORMATION_AFTER,
} from '@shopgate/engage/core';
import portalProps from '../../portalProps';
import Section from '../Section';
import Shipping from './components/Shipping';
import Payment from './components/Payment';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import ReturnPolicy from './components/ReturnPolicy';
import Imprint from './components/Imprint';

/**
 * The StoreInfoComponent.
 * @returns {JSX}
 */
const StoreInfo = () => (
  <Fragment>
    <Portal name={NAV_MENU_STORE_INFORMATION_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_STORE_INFORMATION} props={portalProps}>
      <Section title="navigation.store_information">
        <Shipping />
        <Payment />
        <Terms />
        <Privacy />
        <ReturnPolicy />
        <Imprint />
      </Section>
    </Portal>
    <Portal name={NAV_MENU_STORE_INFORMATION_AFTER} props={portalProps} />
  </Fragment>
);

export default StoreInfo;
