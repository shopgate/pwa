import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_SCANNER,
  NAV_MENU_SCANNER_AFTER,
  NAV_MENU_SCANNER_BEFORE,
} from '@shopgate/pwa-common/constants/Portals';
import { SCANNER_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import Portal from '@shopgate/pwa-common/components/Portal';
import BarcodeScannerIcon from '@shopgate/pwa-ui-shared/icons/BarcodeScannerIcon';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import connect from '../../../../connector';
import portalProps from '../../../../portalProps';

const LABEL = 'navigation.scanner';

/**
 * @param {Function} props.navigate The navigate action.
 * @returns {JSX}
 */
const ScannerButton = ({ navigate }) => (
  <Fragment>
    <Portal name={NAV_MENU_SCANNER_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_SCANNER} props={portalProps}>
      <NavDrawer.Item
        label={LABEL}
        icon={BarcodeScannerIcon}
        onClick={navigate(SCANNER_PATH, LABEL)}
        testId="navDrawerHomeButton"
      />
    </Portal>
    <Portal name={NAV_MENU_SCANNER_AFTER} props={portalProps} />
  </Fragment>
);

ScannerButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default connect(ScannerButton);
