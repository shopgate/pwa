import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * No operational default handler
 */
const noop = () => { };

/**
 * An toggle icon with toggle handlers.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function ToggleIcon(props) {
  const [on, setOn] = useState(props.on);

  useEffect(() => {
    setOn(props.on);
  }, [props.on]);

  /**
   * Handles toggle.
   */
  function handleToggle() {
    setOn(!on);
    props.toggleHandler(!on);
  }

  return (
    <div onClick={handleToggle} aria-hidden>
      {on ? props.onIcon : props.offIcon}
    </div>
  );
}

ToggleIcon.propTypes = {
  /* Off icon from icons library */
  offIcon: PropTypes.element.isRequired,
  /* On icon from icons library */
  onIcon: PropTypes.element.isRequired,
  /* Initial state, default is true */
  on: PropTypes.bool,
  /** Will be called with true|false whe toggle is changed. Default is noop */
  toggleHandler: PropTypes.func,
};

ToggleIcon.defaultProps = {
  on: true,
  toggleHandler: noop,
};

export default ToggleIcon;
