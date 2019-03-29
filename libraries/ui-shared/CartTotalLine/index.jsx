import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Label from './components/Label';
import Amount from './components/Amount';
import Hint from './components/Hint';
import styles from './style';

/**
 * @returns {JSX}
 */
const CartTotalLine = ({ children, type, isDisabled }) => (
  <div
    className={classNames(styles.line, {
    [styles.disabled]: isDisabled,
    [styles[type] || styles.base]: true,
  })}
    data-test-id={`${type}CartTotal`}
  >
    {children}
  </div>
);

CartTotalLine.propTypes = {
  children: PropTypes.node.isRequired,
  isDisabled: PropTypes.bool,
  type: PropTypes.string,
};

CartTotalLine.defaultProps = {
  isDisabled: false,
  type: null,
};

CartTotalLine.Label = Label;
CartTotalLine.Amount = Amount;
CartTotalLine.Hint = Hint;

export default CartTotalLine;
