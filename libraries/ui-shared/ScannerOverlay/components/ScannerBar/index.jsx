import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import FlashlightButton from './components/FlashlightButton';

// TODO SCANNER: add locales for the scanner bar into locale files (for all locale files)
// TODO SCANNER: style the scanner bar

/**
 * @param {boolean} flashlightState The on/off state of the flashlight.
 * @param {Function} onToggleFlashlight The toggle event triggered by the user.
 * @returns {JSX}
 * @constructor
 */
const ScannerBar = ({ flashlightState, onToggleFlashlight }) => (
  <div>
    <div>
      <FlashlightButton onToggle={onToggleFlashlight} flashlightState={flashlightState} />
    </div>
    <div>
      <I18n.Text string="scannerOverlay.scannerBar.instructions" />
    </div>
  </div>
);
ScannerBar.propTypes = {
  flashlightState: PropTypes.bool.isRequired,
  onToggleFlashlight: PropTypes.func.isRequired,
};

export default ScannerBar;
