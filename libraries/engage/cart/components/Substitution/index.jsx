import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Toggle } from '@shopgate/engage/components';
import {
  root, checkbox, rightSpace, text,
} from './style';
import connect from './connector';

/**
 * Renders the cart reservation card label.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const Substitution = ({
  id, onChange, checked, className, label, disabled,
}) => (
  <div className={classNames(root, className)}>
    <label aria-hidden className={text} htmlFor={id} id={`${id}-label`}>
      {label}
    </label>
    <div className={rightSpace}>
      <Toggle
        className={checkbox}
        checked={checked}
        id={id}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  </div>
);

Substitution.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

Substitution.defaultProps = {
  className: undefined,
  disabled: false,
  checked: false,
};

/**
 * Gate component for Substitution.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Wrapper = ({
  substitutionPreferencesEnabled, children,
}) => (
  substitutionPreferencesEnabled ? children : null
);

Wrapper.propTypes = {
  substitutionPreferencesEnabled: PropTypes.bool.isRequired,
};

const ConnectedWrapper = connect(Wrapper);

export { ConnectedWrapper as SubstitutionWrapper };

export default Substitution;
