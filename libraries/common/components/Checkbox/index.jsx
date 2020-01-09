import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Base checkbox component.
 * @param {Object} props The Checkbox properties.
 * @returns {JSX}
 */
function Checkbox(props) {
  const {
    checkedIcon, uncheckedIcon, checked, className, defaultChecked,
    disabled, label, labelPosition, name, onCheck,
  } = props;
  const [checkedState, setCheckedState] = useState(defaultChecked || checked);

  useEffect(() => {
    if (typeof defaultChecked !== 'undefined') {
      return;
    }

    if (checkedState !== checked) {
      setCheckedState(checked);
    }
  }, [checked, defaultChecked, checkedState]);

  /**
   * Returns if the checkbox is checked or not.
   * @return {boolean} Is the checkbox checked?
   */
  function isChecked() {
    return (typeof defaultChecked === 'undefined') ? checked : checkedState;
  }

  /**
  * Inverts the current "checked" value and calls the callback function with it.
  * If the checkbox is uncontrolled, it keeps track of the value.
  */
  function handleCheck() {
    if (disabled) {
      return;
    }

    const checkedResult = !isChecked();

    if (typeof defaultChecked !== 'undefined') {
      setCheckedState(checkedResult);
    }

    onCheck(checkedResult);
  }

  return (
    <div className={className} onClick={handleCheck} aria-hidden>
      {name && <input type="hidden" name={name} value={isChecked() ? 1 : 0} />}
      {labelPosition === 'left' && label}
      {isChecked() ? checkedIcon : uncheckedIcon}
      {labelPosition === 'right' && label}
    </div>
  );
}

Checkbox.propTypes = {
  checkedIcon: PropTypes.node.isRequired,
  uncheckedIcon: PropTypes.node.isRequired,
  checked: PropTypes.bool,
  className: PropTypes.string,
  defaultChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  labelPosition: PropTypes.oneOf(['left', 'right']),
  name: PropTypes.string,
  onCheck: PropTypes.func,
};

Checkbox.defaultProps = {
  checked: undefined,
  className: undefined,
  defaultChecked: undefined,
  disabled: false,
  label: null,
  labelPosition: 'left',
  name: undefined,
  onCheck: () => { },
};

export default Checkbox;
