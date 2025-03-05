import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  SCANNER_SCOPE_DEFAULT,
  SCANNER_TYPE_BARCODE,
} from '@shopgate/pwa-core/constants/Scanner';
import {
  NAV_MENU_SCANNER,
  NAV_MENU_SCANNER_AFTER,
  NAV_MENU_SCANNER_BEFORE,
} from '@shopgate/pwa-common/constants/Portals';
import { Portal } from '@shopgate/engage/components';
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
  <Fragment>
    <Portal name={NAV_MENU_SCANNER_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_SCANNER} props={portalProps}>
      { hasScannerSupport &&
        <NavDrawer.Item
          label={LABEL}
          icon={BarcodeScannerIcon}
          onClick={navigate(getScannerRoute(SCANNER_SCOPE_DEFAULT, SCANNER_TYPE_BARCODE), LABEL)}
          testId="navDrawerScannerButton"
        />
      }
    </Portal>
    <Portal name={NAV_MENU_SCANNER_AFTER} props={portalProps} />
  </Fragment>
);

ScannerButton.propTypes = {
  hasScannerSupport: PropTypes.bool.isRequired,
  navigate: PropTypes.func.isRequired,
};

// Combine two different connectors to reuse the existing functionality.
export default connect(navDrawerConnect(ScannerButton));
