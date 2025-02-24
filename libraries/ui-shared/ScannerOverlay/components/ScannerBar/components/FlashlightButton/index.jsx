import React from 'react';
import PropTypes from 'prop-types';
import ToggleIcon from '@shopgate/pwa-ui-shared/ToggleIcon';
import FlashEnabledIcon from '@shopgate/pwa-ui-shared/icons/FlashEnabledIcon';
import FlashDisabledIcon from '@shopgate/pwa-ui-shared/icons/FlashDisabledIcon';
import { SCANNER_FLASH } from '@shopgate/pwa-common-commerce/scanner/constants/Portals';
import { SurroundPortals } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import styles from './style';

/**
 * The FlashlightButton component.
 * @returns {JSX.Element}
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
      type="button"
      aria-label={i18n.text(flashlightState ? 'scanner.flashlight.switchOff' : 'scanner.flashlight.switchOn')}
    >
      <ToggleIcon
        on={flashlightState}
        onIcon={<FlashEnabledIcon className={styles.icon} />}
        offIcon={<FlashDisabledIcon className={styles.icon} />}
      />
    </button>
    <div className="sr-only" role="status" aria-live="polite">
      {i18n.text(flashlightState ? 'scanner.flashlight.on' : 'scanner.flashlight.off')}
    </div>
  </SurroundPortals>
);

FlashlightButton.propTypes = {
  flashlightState: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default FlashlightButton;
