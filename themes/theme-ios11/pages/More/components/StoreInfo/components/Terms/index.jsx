import React, { Fragment } from 'react';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  NAV_MENU_TERMS_BEFORE,
  NAV_MENU_TERMS,
  NAV_MENU_TERMS_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import { TERMS_PATH } from '@shopgate/engage/page';
import portalProps from '../../../../portalProps';
import Item from '../../../Item';

/**
 * The TermsComponent.
 * @returns {JSX.Element}
 */
const Terms = () => (
  <Fragment>
    <Portal name={NAV_MENU_TERMS_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_TERMS} props={portalProps}>
      <Item href={TERMS_PATH} label="navigation.terms" />
    </Portal>
    <Portal name={NAV_MENU_TERMS_AFTER} props={portalProps} />
  </Fragment>
);

export default Terms;
