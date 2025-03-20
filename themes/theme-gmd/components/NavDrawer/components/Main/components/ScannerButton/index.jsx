import React from 'react';
import PropTypes from 'prop-types';
import {
  SCANNER_SCOPE_DEFAULT,
  SCANNER_TYPE_BARCODE,
} from '@shopgate/pwa-core/constants/Scanner';
import { NAV_MENU_SCANNER } from '@shopgate/pwa-common/constants/Portals';
import { SurroundPortals } from '@shopgate/engage/components';
import { getScannerRoute } from '@shopgate/pwa-common-commerce/scanner/helpers';
import BarcodeScannerIcon from '@shopgate/pwa-ui-shared/icons/BarcodeScannerIcon';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import connect from './connector';
import navDrawerConnect from '../../../../connector';
import portalProps from '../../../../portalProps';

const LABEL = 'navigation.scanner';

/**
 * @param {Object} props The component props
 * @param {boolean} props.hasScannerSupport whether device supports scanner
 * @param {Function} props.navigate The navigate action.
 * @returns {JSX.Element}
 */
const ScannerButton = ({ hasScannerSupport, navigate }) => (
  <SurroundPortals portalName={NAV_MENU_SCANNER} portalProps={portalProps}>
    { hasScannerSupport &&
    <NavDrawer.Item
      label={LABEL}
      icon={BarcodeScannerIcon}
      onClick={navigate(getScannerRoute(SCANNER_SCOPE_DEFAULT, SCANNER_TYPE_BARCODE), LABEL)}
      testId="navDrawerScannerButton"
    />
      }
  </SurroundPortals>
);

ScannerButton.propTypes = {
  hasScannerSupport: PropTypes.bool.isRequired,
  navigate: PropTypes.func.isRequired,
};

// Combine two different connectors to reuse the existing functionality.
export default connect(navDrawerConnect(ScannerButton));
