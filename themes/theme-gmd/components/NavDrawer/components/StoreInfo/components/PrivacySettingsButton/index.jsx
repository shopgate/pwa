import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_PRIVACY_SETTINGS,
  NAV_MENU_PRIVACY_SETTINGS_AFTER,
  NAV_MENU_PRIVACY_SETTINGS_BEFORE,
} from '@shopgate/engage/core';
import { Portal } from '@shopgate/engage/components';
import SecurityIcon from '@shopgate/pwa-ui-shared/icons/SecurityIcon';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import { COOKIE_CONSENT_PATTERN } from '@shopgate/engage/tracking/constants';
import portalProps from '../../../../portalProps';
import connect from '../../../../connector';

const LABEL = 'navigation.privacySettings';

/**
 * @param {Function} navigate The navigate action.
 * @returns {JSX.Element}
 */
const PrivacySettingsButton = ({ navigate }) => (
  <Fragment>
    <Portal name={NAV_MENU_PRIVACY_SETTINGS_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_PRIVACY_SETTINGS} props={portalProps}>
      <NavDrawer.Item
        label={LABEL}
        icon={SecurityIcon}
        onClick={navigate(COOKIE_CONSENT_PATTERN)}
        testId="navDrawerPrivacySettingsButton"
      />
    </Portal>
    <Portal name={NAV_MENU_PRIVACY_SETTINGS_AFTER} props={portalProps} />
  </Fragment>
);

PrivacySettingsButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default connect(PrivacySettingsButton);
