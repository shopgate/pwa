import React, { Fragment } from 'react';
import { Portal } from '@shopgate/engage/components';
import {
  NAV_MENU_IMPRINT_BEFORE,
  NAV_MENU_IMPRINT,
  NAV_MENU_IMPRINT_AFTER,
} from '@shopgate/engage/core';
import { IMPRINT_PATH } from '../../../../constants';
import portalProps from '../../../../portalProps';
import Item from '../../../Item';

/**
 * The ImprintComponent.
 * @returns {JSX}
 */
const Imprint = () => (
  <Fragment>
    <Portal name={NAV_MENU_IMPRINT_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_IMPRINT} props={portalProps}>
      <Item href={IMPRINT_PATH} label="navigation.about" />
    </Portal>
    <Portal name={NAV_MENU_IMPRINT_AFTER} props={portalProps} />
  </Fragment>
);

export default Imprint;
