import React from 'react';
import PropTypes from 'prop-types';
import {
  SurroundPortals, ToggleIcon, FlashEnabledIcon, FlashDisabledIcon,
} from '@shopgate/engage/components';
import { SCANNER_FLASH } from '@shopgate/engage/scanner/constants';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  button: {
    alignItems: 'center',
    color: 'inherit',
    display: 'flex',
    flexShrink: 0,
    fontSize: 24,
    height: 44,
    justifyContent: 'center',
    outline: 0,
    padding: 0,
    position: 'relative',
    width: 44,
    zIndex: 1,
  },
  icon: {
    boxSizing: 'content-box',
    color: 'var(--color-secondary)',
  },
});

/**
 * Renders the flashlight button for the scanner bar.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const FlashlightButton = ({
  flashlightState,
  onToggle,
}) => {
  const { classes } = useStyles();

  return (
    <SurroundPortals portalName={SCANNER_FLASH}>
      <button
        className={classes.button}
        onClick={onToggle}
        role="link"
        type="button"
        aria-label={i18n.text(flashlightState ? 'scanner.flashlight.switchOff' : 'scanner.flashlight.switchOn')}
      >
        <ToggleIcon
          on={flashlightState}
          onIcon={<FlashEnabledIcon className={classes.icon} />}
          offIcon={<FlashDisabledIcon className={classes.icon} />}
        />
      </button>
      <div className="sr-only" role="status" aria-live="polite">
        {i18n.text(flashlightState ? 'scanner.flashlight.on' : 'scanner.flashlight.off')}
      </div>
    </SurroundPortals>
  );
};

FlashlightButton.propTypes = {
  flashlightState: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default FlashlightButton;
