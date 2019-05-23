import React from 'react';
import I18n from '@shopgate/pwa-common/components/I18n';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { SCANNER_INSTRUCTIONS } from '@shopgate/pwa-common-commerce/scanner/constants/Portals';

/**
 * The FlashlightButton component.
 * @returns {JSX}
 */
const ScannerInstructions = () => (
  <SurroundPortals portalName={SCANNER_INSTRUCTIONS}>
    <I18n.Text string="scanner.instructions" />
  </SurroundPortals>
);

export default ScannerInstructions;
