import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Grid, SurroundPortals } from '@shopgate/engage/components';
import { SCANNER_BAR } from '@shopgate/engage/scanner/constants';
import { themeShadows, themeColors, themeVariables } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';
import FlashlightButton from './components/FlashlightButton';
import ScannerInstructions from './components/ScannerInstructions';

const useStyles = makeStyles()({
  container: {
    bottom: 0,
    backgroundColor: themeColors.overlay,
    boxShadow: themeShadows.scannerBar,
    fontSize: 14,
    alignItems: 'center',
    paddingBottom: 'var(--safe-area-inset-bottom)',
  },
  column: {
    margin: `${themeVariables.gap.big}px`,
    ':not(:first-child)': {
      marginLeft: 0,
    },
  },
});

/**
 * Renders the scanner bar into `#AppFooter` via a portal.
 * @param {Object} props Props.
 * @param {boolean} props.flashlightState Flashlight on/off.
 * @param {Function} props.onToggleFlashlight Toggle handler.
 * @returns {React.ReactPortal}
 */
const ScannerBar = ({ flashlightState, onToggleFlashlight }) => {
  const { classes, cx } = useStyles();

  return createPortal(
    (
      <SurroundPortals
        portalName={SCANNER_BAR}
        portalProps={{
          flashlightState,
          onToggleFlashlight,
        }}
      >
        <Grid className={cx(classes.container, 'ui-shared__scanner-bar')}>
          <Grid.Item className={classes.column}>
            <FlashlightButton onToggle={onToggleFlashlight} flashlightState={flashlightState} />
          </Grid.Item>
          <Grid.Item className={classes.column}>
            <ScannerInstructions />
          </Grid.Item>
        </Grid>
      </SurroundPortals>
    ),
    document.getElementById('AppFooter')
  );
};

ScannerBar.propTypes = {
  flashlightState: PropTypes.bool.isRequired,
  onToggleFlashlight: PropTypes.func.isRequired,
};

export default ScannerBar;
