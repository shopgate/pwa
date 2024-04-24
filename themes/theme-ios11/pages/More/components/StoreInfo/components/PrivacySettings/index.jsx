import React, { Fragment } from 'react';
import {
  NAV_MENU_PRIVACY_SETTINGS,
  NAV_MENU_PRIVACY_SETTINGS_AFTER,
  NAV_MENU_PRIVACY_SETTINGS_BEFORE,
} from '@shopgate/engage/core';
import { Portal } from '@shopgate/engage/components';
import { COOKIE_CONSENT_PATTERN } from '@shopgate/engage/tracking/constants';
import portalProps from '../../../../portalProps';
import Item from '../../../Item';

/**
 The PrivacySettingsComponent.
 * @returns {JSX.Element}
 */
const PrivacySettings = () => (
  <Fragment>
    <Portal name={NAV_MENU_PRIVACY_SETTINGS_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_PRIVACY_SETTINGS} props={portalProps}>
      <Item
        label="navigation.privacySettings"
        href={COOKIE_CONSENT_PATTERN}
      />
    </Portal>
    <Portal name={NAV_MENU_PRIVACY_SETTINGS_AFTER} props={portalProps} />
  </Fragment>
);

export default PrivacySettings;
