import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_PRIVACY,
  NAV_MENU_PRIVACY_AFTER,
  NAV_MENU_PRIVACY_BEFORE,
} from '@shopgate/pwa-common/constants/Portals';
import { PAGE_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import Portal from '@shopgate/pwa-common/components/Portal';
import SecurityIcon from '@shopgate/pwa-ui-shared/icons/SecurityIcon';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import connect from '../../connector';

const LABEL = 'navigation.privacy';
const PRIVACY_PATH = `${PAGE_PATH}/privacy`;

/**
 * @param {Function} props.navigate The navigate action.
 * @returns {JSX}
 */
const PrivacyButton = ({ navigate }) => (
  <Fragment>
    <Portal name={NAV_MENU_PRIVACY_BEFORE} />
    <Portal name={NAV_MENU_PRIVACY}>
      <NavDrawer.Item
        label={LABEL}
        icon={SecurityIcon}
        onClick={navigate(PRIVACY_PATH, LABEL)}
        testId="navDrawerPrivacyButton"
      />
    </Portal>
    <Portal name={NAV_MENU_PRIVACY_AFTER} />
  </Fragment>
);

PrivacyButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default connect(PrivacyButton);
