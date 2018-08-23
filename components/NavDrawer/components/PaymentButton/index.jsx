import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_PAYMENT,
  NAV_MENU_PAYMENT_AFTER,
  NAV_MENU_PAYMENT_BEFORE,
} from '@shopgate/pwa-common-commerce/market/constants/Portals';
import { PAGE_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import Portal from '@shopgate/pwa-common/components/Portal';
import CreditCardIcon from '@shopgate/pwa-ui-shared/icons/CreditCardIcon';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import consume from '../../consumer';

const LABEL = 'navigation.payment';
const PAYMENT_PATH = `${PAGE_PATH}/payment`;

/**
 * @param {Function} props.navigate The navigate action.
 * @returns {JSX}
 */
const PaymentButton = ({ navigate }) => (
  <Fragment>
    <Portal name={NAV_MENU_PAYMENT_BEFORE} />
    <Portal name={NAV_MENU_PAYMENT}>
      <NavDrawer.Item
        label={LABEL}
        icon={CreditCardIcon}
        onClick={navigate(PAYMENT_PATH, LABEL)}
      />
    </Portal>
    <Portal name={NAV_MENU_PAYMENT_AFTER} />
  </Fragment>
);

PaymentButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default consume(PaymentButton);
