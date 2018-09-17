import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_SHIPPING,
  NAV_MENU_SHIPPING_AFTER,
  NAV_MENU_SHIPPING_BEFORE,
} from '@shopgate/pwa-common-commerce/market/constants/Portals';
import { PAGE_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import Portal from '@shopgate/pwa-common/components/Portal';
import LocalShippingIcon from '@shopgate/pwa-ui-shared/icons/LocalShippingIcon';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import connect from '../../connector';

const LABEL = 'navigation.shipping';
const SHIPPING_PATH = `${PAGE_PATH}/shipping`;

/**
 * @param {Function} props.navigate The navigate action.
 * @returns {JSX}
 */
const ShippingButton = ({ navigate }) => (
  <Fragment>
    <Portal name={NAV_MENU_SHIPPING_BEFORE} />
    <Portal name={NAV_MENU_SHIPPING}>
      <NavDrawer.Item
        label={LABEL}
        icon={LocalShippingIcon}
        onClick={navigate(SHIPPING_PATH, LABEL)}
        testId="navDrawerShippingButton"
      />
    </Portal>
    <Portal name={NAV_MENU_SHIPPING_AFTER} />
  </Fragment>
);

ShippingButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default connect(ShippingButton);
