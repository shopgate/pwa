import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_PRIVACY,
  NAV_MENU_PRIVACY_AFTER,
  NAV_MENU_PRIVACY_BEFORE,
} from '@shopgate/pwa-common/constants/Portals';
import Portal from '@shopgate/pwa-common/components/Portal';
import SecurityIcon from '@shopgate/pwa-ui-shared/icons/SecurityIcon';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import { PRIVACY_PATH } from '../../../../constants';
import portalProps from '../../../../portalProps';
import connect from '../../../../connector';

const LABEL = 'navigation.privacy';

/**
 * @param {Function} props.navigate The navigate action.
 * @returns {JSX}
 */
const PrivacyButton = ({ navigate }) => (
  <Fragment>
    <Portal name={NAV_MENU_PRIVACY_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_PRIVACY} props={portalProps}>
      <NavDrawer.Item
        label={LABEL}
        icon={SecurityIcon}
        onClick={navigate(PRIVACY_PATH, LABEL)}
        testId="navDrawerPrivacyButton"
      />
    </Portal>
    <Portal name={NAV_MENU_PRIVACY_AFTER} props={portalProps} />
  </Fragment>
);

PrivacyButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default connect(PrivacyButton);
