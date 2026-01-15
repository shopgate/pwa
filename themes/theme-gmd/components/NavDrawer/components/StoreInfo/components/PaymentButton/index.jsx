import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_PAYMENT,
  NAV_MENU_PAYMENT_AFTER,
  NAV_MENU_PAYMENT_BEFORE,
} from '@shopgate/engage/market';
import {
  Portal,
  NavDrawer,
  CreditCardIcon,
} from '@shopgate/engage/components';
import { PAYMENT_PATH } from '@shopgate/engage/page/constants';
import portalProps from '../../../../portalProps';
import connect from '../../../../connector';

const LABEL = 'navigation.payment';

/**
 * @param {Object} props The component props
 * @param {Function} props.navigate The navigate props
 * @returns {JSX.Element}
 */
const PaymentButton = ({ navigate }) => (
  <>
    <Portal name={NAV_MENU_PAYMENT_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_PAYMENT} props={portalProps}>
      <NavDrawer.Item
        label={LABEL}
        icon={CreditCardIcon}
        onClick={navigate(PAYMENT_PATH, LABEL)}
        testId="navDrawerPaymentButton"
      />
    </Portal>
    <Portal name={NAV_MENU_PAYMENT_AFTER} props={portalProps} />
  </>
);

PaymentButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default connect(PaymentButton);
