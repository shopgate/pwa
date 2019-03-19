import React from 'react';
import PropTypes from 'prop-types';
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
    { flashlightState ? (
      <FlashOnIcon className={styles.icon} />
    ) : (
      <FlashOffIcon className={styles.icon} />
    )}
  </button>
);

FlashlightButton.propTypes = {
  flashlightState: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default FlashlightButton;
