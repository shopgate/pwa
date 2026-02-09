import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_SHIPPING,
  NAV_MENU_SHIPPING_AFTER,
  NAV_MENU_SHIPPING_BEFORE,
} from '@shopgate/engage/market';
import {
  Portal,
  NavDrawer,
  LocalShippingIcon,
} from '@shopgate/engage/components';
import { SHIPPING_PATH } from '@shopgate/engage/page/constants';
import portalProps from '../../../../portalProps';
import connect from '../../../../connector';

const LABEL = 'navigation.shipping';

/**
 * @param {Object} props The component props
 * @param {Function} props.navigate The navigate props
 * @returns {JSX.Element}
 */
const ShippingButton = ({ navigate }) => (
  <>
    <Portal name={NAV_MENU_SHIPPING_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_SHIPPING} props={portalProps}>
      <NavDrawer.Item
        label={LABEL}
        icon={LocalShippingIcon}
        onClick={navigate(SHIPPING_PATH, LABEL)}
        testId="navDrawerShippingButton"
      />
    </Portal>
    <Portal name={NAV_MENU_SHIPPING_AFTER} props={portalProps} />
  </>
);

ShippingButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default connect(ShippingButton);
