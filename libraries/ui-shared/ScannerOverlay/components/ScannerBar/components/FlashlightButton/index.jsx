import React from 'react';
import PropTypes from 'prop-types';
import ToggleIcon from '@shopgate/pwa-ui-shared/ToggleIcon';
import FlashOnIcon from '@shopgate/pwa-ui-shared/icons/FlashOnIcon';
import FlashOffIcon from '@shopgate/pwa-ui-shared/icons/FlashOffIcon';
import styles from './style';

/**
 * The FlashlightButton component.
 * @returns {JSX}
 */
const FlashlightButton = ({
  flashlightState,
  onToggle,
}) => (
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
);

FlashlightButton.propTypes = {
  flashlightState: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default FlashlightButton;
