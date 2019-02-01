import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_IMPRINT,
  NAV_MENU_IMPRINT_AFTER,
  NAV_MENU_IMPRINT_BEFORE,
} from '@shopgate/pwa-common/constants/Portals';
import Portal from '@shopgate/pwa-common/components/Portal';
import InfoIcon from '@shopgate/pwa-ui-shared/icons/InfoIcon';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import { IMPRINT_PATH } from '../../../../constants';
import portalProps from '../../../../portalProps';
import connect from '../../../../connector';

const LABEL = 'navigation.about';

/**
 * @param {Function} props.navigate The navigate action.
 * @returns {JSX}
 */
const ImprintButton = ({ navigate }) => (
  <Fragment>
    <Portal name={NAV_MENU_IMPRINT_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_IMPRINT} props={portalProps}>
      <NavDrawer.Item
        label={LABEL}
        icon={InfoIcon}
        onClick={navigate(IMPRINT_PATH, LABEL)}
        testId="navDrawerImprintButton"
      />
    </Portal>
    <Portal name={NAV_MENU_IMPRINT_AFTER} props={portalProps} />
  </Fragment>
);

ImprintButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default connect(ImprintButton);
