import React from 'react';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { SCANNER_CAMERA } from '@shopgate/pwa-common-commerce/scanner/constants/Portals';
import styles from './style';

/**
 * @returns {JSX}
 */
const CameraOverlay = () => (
  <SurroundPortals portalName={SCANNER_CAMERA}>
    <div className={styles}>
      <div />
    </div>
  </SurroundPortals>
);

export default CameraOverlay;
