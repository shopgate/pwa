import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import NotificationIcon from '@shopgate/pwa-ui-shared/icons/NotificationIcon';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import { BACK_IN_STOCK_PATTERN } from '@shopgate/engage/back-in-stock';
import {
  NAV_MENU_BACK_IN_STOCK,
  NAV_MENU_BACK_IN_STOCK_AFTER,
  NAV_MENU_BACK_IN_STOCK_BEFORE,
} from '@shopgate/engage/back-in-stock/constants/Portals';
import navDrawerConnect from '../../../../connector';
import portalProps from '../../../../portalProps';
import Badge from './components/Badge';
import connect from './connector';

const LABEL = 'navigation.back_in_stock';

/**
 * @param {Function} navigate The navigate action.
 * @param {boolean} isBackInStockEnabled Whether the back in stock feature is enabled
 * @returns {JSX}
 */
const BackInStockButton = ({ navigate, isBackInStockEnabled }) => (
  <Fragment>
    <Portal name={NAV_MENU_BACK_IN_STOCK_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_BACK_IN_STOCK} props={portalProps}>
      { isBackInStockEnabled &&
      <NavDrawer.Item
        badge={Badge}
        label={LABEL}
        icon={NotificationIcon}
        aria-hidden
        onClick={navigate(BACK_IN_STOCK_PATTERN, LABEL)}
        testId="navDrawerBackInStockButton"
      />
      }
    </Portal>
    <Portal name={NAV_MENU_BACK_IN_STOCK_AFTER} props={portalProps} />
  </Fragment>
);

BackInStockButton.propTypes = {
  isBackInStockEnabled: PropTypes.bool.isRequired,
  navigate: PropTypes.func.isRequired,
};

// Combine two different connectors to reuse the existing functionality.
export default navDrawerConnect(connect(BackInStockButton));
