import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { isVersionAtLeast } from '@shopgate/pwa-core/helpers/version';
import {
  SCANNER_SCOPE_DEFAULT,
  SCANNER_TYPE_BARCODE,
} from '@shopgate/pwa-core/constants/Scanner';
import { SCANNER_MIN_APP_LIB_VERSION } from '@shopgate/pwa-core/classes/Scanner';
import {
  NAV_MENU_SCANNER,
  NAV_MENU_SCANNER_AFTER,
  NAV_MENU_SCANNER_BEFORE,
} from '@shopgate/pwa-common/constants/Portals';
import { scannerPath } from '@shopgate/pwa-common/constants/RoutePaths';
import Portal from '@shopgate/pwa-common/components/Portal';
// TODO SCANNER: replace BarcodeScannerIcon with new svg from ticket
import BarcodeScannerIcon from '@shopgate/pwa-ui-shared/icons/BarcodeScannerIcon';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import clientConnect from '@shopgate/pwa-ui-shared/ClientInformation/connector';
import navDrawerConnect from '../../../../connector';
import portalProps from '../../../../portalProps';

const LABEL = 'navigation.scanner';

/**
 * @param {Function} props.navigate The navigate action.
 * @param {Function} props.libVersion The lib version the app is currently running on.
 * @returns {JSX}
 */
const ScannerButton = ({ navigate, libVersion }) => (
  <Fragment>
    <Portal name={NAV_MENU_SCANNER_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_SCANNER} props={portalProps}>
      { isVersionAtLeast(SCANNER_MIN_APP_LIB_VERSION, libVersion) &&
        <NavDrawer.Item
          label={LABEL}
          icon={BarcodeScannerIcon}
          onClick={navigate(scannerPath(SCANNER_SCOPE_DEFAULT, SCANNER_TYPE_BARCODE), LABEL)}
          testId="navDrawerScannerButton"
        />
      }
    </Portal>
    <Portal name={NAV_MENU_SCANNER_AFTER} props={portalProps} />
  </Fragment>
);

ScannerButton.propTypes = {
  navigate: PropTypes.func.isRequired,
  libVersion: PropTypes.string,
};

ScannerButton.defaultProps = {
  libVersion: '1.0',
};

export default clientConnect(navDrawerConnect(ScannerButton));
