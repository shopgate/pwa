import React from 'react';
import PropTypes from 'prop-types';
import ToggleIcon from '@shopgate/pwa-ui-shared/ToggleIcon';
import FlashOnIcon from '@shopgate/pwa-ui-shared/icons/FlashOnIcon';
import FlashOffIcon from '@shopgate/pwa-ui-shared/icons/FlashOffIcon';
import { SCANNER_FLASH } from '@shopgate/pwa-common-commerce/scanner/constants/Portals';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import styles from './style';

/**
 * The FlashlightButton component.
 * @returns {JSX}
 */
const FlashlightButton = ({
  flashlightState,
  onToggle,
}) => (
  <SurroundPortals portalName={SCANNER_FLASH}>
    <button
      className={styles.button}
      onClick={onToggle}
      role="link"
    >
      <ToggleIcon
        on={flashlightState}
        onIcon={<FlashOnIcon className={styles.icon} />}
        offIcon={<FlashOffIcon className={styles.icon} />}
      />
    </button>
  </SurroundPortals>
);

FlashlightButton.propTypes = {
  flashlightState: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default FlashlightButton;
