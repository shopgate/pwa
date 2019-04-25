import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import I18n from '@shopgate/pwa-common/components/I18n';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { SCANNER_BAR } from '@shopgate/pwa-common-commerce/scanner/constants/Portals';
import FlashlightButton from './components/FlashlightButton';
import styles from './style';

/**
 * @param {boolean} flashlightState The on/off state of the flashlight.
 * @param {Function} onToggleFlashlight The toggle event triggered by the user.
 * @returns {JSX}
 */
const ScannerBar = ({ flashlightState, onToggleFlashlight }) => createPortal(
  (
    <SurroundPortals portalName={SCANNER_BAR}>
      <Grid className={styles.container}>
        <Grid.Item className={styles.column}>
          <FlashlightButton onToggle={onToggleFlashlight} flashlightState={flashlightState} />
        </Grid.Item>
        <Grid.Item className={styles.column}>
          <I18n.Text string="scanner.instructions" />
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
