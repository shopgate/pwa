import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_HOME,
  NAV_MENU_HOME_AFTER,
  NAV_MENU_HOME_BEFORE,
} from '@shopgate/pwa-common/constants/Portals';
import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import Portal from '@shopgate/pwa-common/components/Portal';
import HomeIcon from '@shopgate/pwa-ui-shared/icons/HomeIcon';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import connect from '../../../../connector';
import portalProps from '../../../../portalProps';

const LABEL = 'navigation.home';

/**
 * @param {Function} props.navigate The navigate action.
 * @returns {JSX}
 */
const HomeButton = ({ navigate }) => (
  <Fragment>
    <Portal name={NAV_MENU_HOME_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_HOME} props={portalProps}>
      <NavDrawer.Item
        label={LABEL}
        icon={HomeIcon}
        onClick={navigate(INDEX_PATH, LABEL)}
        testId="navDrawerHomeButton"
      />
    </Portal>
    <Portal name={NAV_MENU_HOME_AFTER} props={portalProps} />
  </Fragment>
);

HomeButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default connect(HomeButton);
