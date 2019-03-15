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
  style,
  testId,
}) => (
  <button
    className={styles.button}
    data-test-id={testId}
    onClick={onToggle}
    role="link"
    style={style}
  >
    <div className={styles.iconWrapper}>
      {flashlightState && <FlashOnIcon className={styles.icon} size={24} />}
      {!flashlightState && <FlashOffIcon className={styles.icon} size={24} />}
    </div>
  </button>
);

FlashlightButton.propTypes = {
  flashlightState: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  style: PropTypes.shape(),
  testId: PropTypes.string,
};

FlashlightButton.defaultProps = {
  style: {},
  testId: null,
};

export default FlashlightButton;
