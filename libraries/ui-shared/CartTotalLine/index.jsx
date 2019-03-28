import React from 'react';
import PropTypes from 'prop-types';
import Label from './components/Label';
import Amount from './components/Amount';
import Hint from './components/Hint';
import styles from './style';

/**
 * @returns {JSX}
 */
const CartTotalLine = ({ children, type }) => (
  <div className={styles} data-test-id={`${type}Label`}>
    {children}
  </div>
);

CartTotalLine.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
};

CartTotalLine.defaultProps = {
  type: '',
};

CartTotalLine.Label = Label;
CartTotalLine.Amount = Amount;
CartTotalLine.Hint = Hint;

export default CartTotalLine;
