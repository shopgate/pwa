import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_IMPRINT,
  NAV_MENU_IMPRINT_AFTER,
  NAV_MENU_IMPRINT_BEFORE,
} from '@shopgate/pwa-common/constants/Portals';
import { PAGE_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import Portal from '@shopgate/pwa-common/components/Portal';
import InfoIcon from '@shopgate/pwa-ui-shared/icons/InfoIcon';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import connect from '../../connector';

const LABEL = 'navigation.about';
const PAYMENT_PATH = `${PAGE_PATH}/imprint`;

/**
 * @param {Function} props.navigate The navigate action.
 * @returns {JSX}
 */
const ReturnsButton = ({ navigate }) => (
  <Fragment>
    <Portal name={NAV_MENU_IMPRINT_BEFORE} />
    <Portal name={NAV_MENU_IMPRINT}>
      <NavDrawer.Item
        label={LABEL}
        icon={InfoIcon}
        onClick={navigate(PAYMENT_PATH, LABEL)}
        testId="navDrawerImprintButton"
      />
    </Portal>
    <Portal name={NAV_MENU_IMPRINT_AFTER} />
  </Fragment>
);

ReturnsButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default connect(ReturnsButton);
