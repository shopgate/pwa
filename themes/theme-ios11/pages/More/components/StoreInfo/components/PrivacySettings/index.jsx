import React, { Fragment } from 'react';
import {
  NAV_MENU_PRIVACY_SETTINGS,
  NAV_MENU_PRIVACY_SETTINGS_AFTER,
  NAV_MENU_PRIVACY_SETTINGS_BEFORE,
} from '@shopgate/pwa-common/constants/Portals';
import Portal from '@shopgate/pwa-common/components/Portal';
import { PRIVACY_SETTINGS_PATH } from '@shopgate/theme-ios11/pages/More/constants';
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
        href={PRIVACY_SETTINGS_PATH}
      />
    </Portal>
    <Portal name={NAV_MENU_PRIVACY_SETTINGS_AFTER} props={portalProps} />
  </Fragment>
);

export default PrivacySettings;
