import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_RETURN_POLICY,
  NAV_MENU_RETURN_POLICY_AFTER,
  NAV_MENU_RETURN_POLICY_BEFORE,
} from '@shopgate/pwa-common-commerce/market/constants/Portals';
import { PAGE_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import Portal from '@shopgate/pwa-common/components/Portal';
import DescriptionIcon from '@shopgate/pwa-ui-shared/icons/DescriptionIcon';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import connect from '../../connector';

const LABEL = 'navigation.return_policy';
const PAYMENT_PATH = `${PAGE_PATH}/return_policy`;

/**
 * @param {Function} props.navigate The navigate action.
 * @returns {JSX}
 */
const ReturnsButton = ({ navigate }) => (
  <Fragment>
    <Portal name={NAV_MENU_RETURN_POLICY_BEFORE} />
    <Portal name={NAV_MENU_RETURN_POLICY}>
      <NavDrawer.Item
        label={LABEL}
        icon={DescriptionIcon}
        onClick={navigate(PAYMENT_PATH, LABEL)}
        testId="navDrawerReturnsButton"
      />
    </Portal>
    <Portal name={NAV_MENU_RETURN_POLICY_AFTER} />
  </Fragment>
);

ReturnsButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default connect(ReturnsButton);
