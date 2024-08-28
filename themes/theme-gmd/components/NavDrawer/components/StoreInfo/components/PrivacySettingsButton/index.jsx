import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_PRIVACY_SETTINGS,
  NAV_MENU_PRIVACY_SETTINGS_AFTER,
  NAV_MENU_PRIVACY_SETTINGS_BEFORE,
} from '@shopgate/engage/core';
import {
  Portal,
  NavDrawer,
  SecurityIcon,
} from '@shopgate/engage/components';
import { PRIVACY_SETTINGS_PATTERN } from '@shopgate/engage/tracking/constants';
import portalProps from '../../../../portalProps';
import connect from '../../../../connector';

const LABEL = 'navigation.privacySettings';

/**
 * @param {Object} props The component props
 * @param {Function} props.navigate The navigate props
 * @returns {JSX.Element}
 */
const PrivacySettingsButton = ({ navigate }) => (
  <Fragment>
    <Portal name={NAV_MENU_PRIVACY_SETTINGS_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_PRIVACY_SETTINGS} props={portalProps}>
      <NavDrawer.Item
        label={LABEL}
        icon={SecurityIcon}
        onClick={navigate(PRIVACY_SETTINGS_PATTERN)}
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
