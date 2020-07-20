import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Toggle } from '@shopgate/engage/components';
import {
  root, checkbox, leftSpace, rightSpace, text,
} from './style';
import connect from './connector';

/**
 * Renders the cart reservation card label.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Substitution = ({
  id, onChange, checked, className, label,
}) => (
  <div className={classNames(root, className)}>
    <div className={leftSpace} />
    <span className={text}>{label}</span>
    <div className={rightSpace}>
      <Toggle
        className={checkbox}
        checked={checked}
        id={id}
        onChange={onChange}
      />
    </div>
  </div>
);

Substitution.propTypes = {
  checked: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

Substitution.defaultProps = {
  className: undefined,
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
