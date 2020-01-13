import React, {
  Fragment, useState, useEffect, memo,
} from 'react';
import PropTypes from 'prop-types';
import AppScanner from '@shopgate/pwa-core/classes/Scanner';
import CameraOverlay from './components/CameraOverlay';
import ScannerBar from './components/ScannerBar';

/**
 * The scanner overlay component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function ScannerOverlay(props) {
  const [flashlight, setFlashlight] = useState(props.flashlight);

  useEffect(() => {
    setFlashlight(props.flashlight);
  }, [props.flashlight]);

  /**
   * Handles toggling the flashlight.
   */
  function handleToggleFlashlight() {
    setFlashlight(AppScanner.toggleFlashlight());
  }

  return (
    <Fragment>
      <CameraOverlay />
      <ScannerBar flashlightState={flashlight} onToggleFlashlight={handleToggleFlashlight} />
    </Fragment>
  );
}

ScannerOverlay.propTypes = {
  flashlight: PropTypes.bool,
};

ScannerOverlay.defaultProps = {
  flashlight: false,
};

export default memo(ScannerOverlay);
