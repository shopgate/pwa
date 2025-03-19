import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Grid, SurroundPortals } from '@shopgate/engage/components';
import { SCANNER_BAR } from '@shopgate/engage/scanner/constants';
import FlashlightButton from './components/FlashlightButton';
import ScannerInstructions from './components/ScannerInstructions';
import styles from './style';

/**
 * @param {Object} props The component props.
 * @param {boolean} props.flashlightState The on/off state of the flashlight.
 * @param {Function} props.onToggleFlashlight The toggle event triggered by the user.
 * @returns {React.ReactPortal} A React portal that renders the scanner bar in the AppFooter.
 */
const ScannerBar = ({ flashlightState, onToggleFlashlight }) => createPortal(
  (
    <SurroundPortals
      portalName={SCANNER_BAR}
      portalProps={{
        flashlightState,
        onToggleFlashlight,
      }}
    >
      <Grid className={`${styles.container} ui-shared__scanner-bar`}>
        <Grid.Item className={styles.column}>
          <FlashlightButton onToggle={onToggleFlashlight} flashlightState={flashlightState} />
        </Grid.Item>
        <Grid.Item className={styles.column}>
          <ScannerInstructions />
        </Grid.Item>
      </Grid>
    </SurroundPortals>
  ),
  document.getElementById('AppFooter')
);

ScannerBar.propTypes = {
  flashlightState: PropTypes.bool.isRequired,
  onToggleFlashlight: PropTypes.func.isRequired,
};

export default ScannerBar;
