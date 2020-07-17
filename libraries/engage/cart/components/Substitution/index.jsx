import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Toggle, I18n } from '@shopgate/engage/components';
import {
  root, checkbox, leftSpace, rightSpace, text,
} from './style';

/**
 * Renders the cart reservation card label.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Substitution = ({
  id, onChange, checked, className,
}) => (
  <div className={classNames(root, className)}>
    <div className={leftSpace} />
    <I18n.Text
      string="cart.allow_substitution_all"
      className={text}
    />
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
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

Substitution.defaultProps = {
  className: undefined,
};

export default Substitution;
