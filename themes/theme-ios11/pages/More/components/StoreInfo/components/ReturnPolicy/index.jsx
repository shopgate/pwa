import React, { Fragment } from 'react';
import showReturnPolicy from '@shopgate/pwa-common-commerce/market/helpers/showReturnPolicy';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  NAV_MENU_RETURN_POLICY_BEFORE,
  NAV_MENU_RETURN_POLICY,
  NAV_MENU_RETURN_POLICY_AFTER,
} from '@shopgate/pwa-common-commerce/market/constants/Portals';
import { RETURN_POLICY_PATH } from '@shopgate/engage/page';
import portalProps from '../../../../portalProps';
import Item from '../../../Item';

/**
 * The ReturnPolicyComponent.
 * @returns {JSX}
 */
const ReturnPolicy = () => (
  <Fragment>
    <Portal name={NAV_MENU_RETURN_POLICY_BEFORE} props={portalProps} />
    {showReturnPolicy && (
      <Portal name={NAV_MENU_RETURN_POLICY} props={portalProps}>
        <Item href={RETURN_POLICY_PATH} label="navigation.return_policy" />
      </Portal>
    )}
    <Portal name={NAV_MENU_RETURN_POLICY_AFTER} props={portalProps} />
  </Fragment>
);

export default ReturnPolicy;
