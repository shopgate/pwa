import React from 'react';
import PropTypes from 'prop-types';
import {
  AVAILABILITY_STATE_OK,
  AVAILABILITY_STATE_WARNING,
  AVAILABILITY_STATE_ALERT,
} from '@shopgate/pwa-common-commerce/product/constants';
import { Typography } from '@shopgate/engage/components';

const stateColorMap = {
  [AVAILABILITY_STATE_OK]: 'success',
  [AVAILABILITY_STATE_WARNING]: 'warning',
  [AVAILABILITY_STATE_ALERT]: 'error',
};

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
  if (!text || (state === AVAILABILITY_STATE_OK && !showWhenAvailable)) {
    return null;
  }

  return (
    <Typography
      variant="body2"
      component="div"
      color={stateColorMap[state]}
      className={`ui-shared__availability${className ? ` ${className}` : ''}`}
      data-test-id={`availabilityText: ${text}`}
    >
      {text}
    </Typography>
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
