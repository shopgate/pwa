import React, { Fragment } from 'react';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  NAV_MENU_PRIVACY_BEFORE,
  NAV_MENU_PRIVACY,
  NAV_MENU_PRIVACY_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import { PRIVACY_PATH } from '../../../../constants';
import portalProps from '../../../../portalProps';
import Item from '../../../Item';

/**
 * The PrivacyComponent.
 * @returns {JSX.Element}
 */
const Privacy = () => (
  <Fragment>
    <Portal name={NAV_MENU_PRIVACY_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_PRIVACY} props={portalProps}>
      <Item href={PRIVACY_PATH} label="navigation.privacy" />
    </Portal>
    <Portal name={NAV_MENU_PRIVACY_AFTER} props={portalProps} />
  </Fragment>
);

export default Privacy;
