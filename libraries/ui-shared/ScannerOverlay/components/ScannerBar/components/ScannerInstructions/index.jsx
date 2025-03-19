import React from 'react';
import { I18n, SurroundPortals } from '@shopgate/engage/components';
import { SCANNER_INSTRUCTIONS } from '@shopgate/engage/scanner/constants';
/**
 * The Scanner Instructions component.
 * @returns {JSX.Element}
 */
const ScannerInstructions = () => (
  <SurroundPortals portalName={SCANNER_INSTRUCTIONS}>
    <I18n.Text string="scanner.instructions" />
  </SurroundPortals>
);

export default ScannerInstructions;
