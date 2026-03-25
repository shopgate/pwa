import React from 'react';
import PropTypes from 'prop-types';
import {
  AVAILABILITY_STATE_OK,
  AVAILABILITY_STATE_WARNING,
  AVAILABILITY_STATE_ALERT,
} from '@shopgate/pwa-common-commerce/product/constants';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  base: {
    fontSize: '0.875rem',
  },
  stateOk: {
    color: 'var(--color-state-ok)',
  },
  stateWarning: {
    color: 'var(--color-state-warning)',
  },
  stateAlert: {
    color: 'var(--color-state-alert)',
  },
});

/**
 * This component renders the availability text for a product
 * @param {Object} props The component props
 * @param {string} props.text The availability text
 * @param {string} props.state The state of the availability text
 * @param {boolean} [props.showWhenAvailable] Tells, if the component shall be rendered, when the
 *   state of the availability text is "ok"
 * @param {string} [props.className] CSS classes
 * @return {JSX}
 */
const Availability = ({
  text, state, showWhenAvailable = false, className = null,
}) => {
  const { classes, cx } = useStyles();

  if (!text || (state === AVAILABILITY_STATE_OK && !showWhenAvailable)) {
    return null;
  }

  let stateClass = classes.stateOk;
  if (state === AVAILABILITY_STATE_WARNING) {
    stateClass = classes.stateWarning;
  }
  if (state === AVAILABILITY_STATE_ALERT) {
    stateClass = classes.stateAlert;
  }

  return (
    <div
      className={cx('ui-shared__availability', className, classes.base, stateClass)}
      data-test-id={`availabilityText: ${text}`}
    >
      {text}
    </div>
  );
};

Availability.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  showWhenAvailable: PropTypes.bool,
  state: PropTypes.string,
};

Availability.defaultProps = {
  className: '',
  showWhenAvailable: false,
  state: AVAILABILITY_STATE_OK,
};

export default Availability;
