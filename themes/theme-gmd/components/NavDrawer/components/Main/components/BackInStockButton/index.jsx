import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_BACK_IN_STOCK,
  NAV_MENU_BACK_IN_STOCK_AFTER,
  NAV_MENU_BACK_IN_STOCK_BEFORE,
} from '@shopgate/pwa-common/constants/Portals';
import Portal from '@shopgate/pwa-common/components/Portal';
import NotificationIcon from '@shopgate/pwa-ui-shared/icons/NotificationIcon';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import { BACK_IN_STOCK_PATTERN } from '@shopgate/engage/back-in-stock';
import navDrawerConnect from '../../../../connector';
import portalProps from '../../../../portalProps';
import Badge from './components/Badge';

const LABEL = 'navigation.back_in_stock';

/**
 * @param {Function} navigate The navigate action.
 * @returns {JSX}
 */
const BackInStockButton = ({ navigate }) => (
  <Fragment>
    <Portal name={NAV_MENU_BACK_IN_STOCK_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_BACK_IN_STOCK} props={portalProps}>
      <NavDrawer.Item
        badge={Badge}
        label={LABEL}
        icon={NotificationIcon}
        aria-hidden
        onClick={navigate(BACK_IN_STOCK_PATTERN, LABEL)}
        testId="navDrawerBackInStockButton"
      />
    </Portal>
    <Portal name={NAV_MENU_BACK_IN_STOCK_AFTER} props={portalProps} />
  </Fragment>
);

BackInStockButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

// Combine two different connectors to reuse the existing functionality.
export default navDrawerConnect(BackInStockButton);
