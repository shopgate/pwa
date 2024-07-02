import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Label from './components/Label';
import Amount from './components/Amount';
import Hint from './components/Hint';
import Spacer from './components/Spacer';
import styles from './style';

/**
 * @returns {JSX}
 */
const CartTotalLine = ({
  children, type, isDisabled, className,
}) => {
  if (!children) {
    return null;
  }

  return (
    <div
      className={classNames(
        className,
        `ui-shared__cart-total-line ui-shared__cart-${type}-line`,
        styles.line,
        {
          [styles.disabled]: isDisabled,
          [styles[type] || styles.base]: true,
        }
      )}
      data-test-id={`${type}CartTotal`}
    >
      {children}
    </div>
  );
};

CartTotalLine.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
  type: PropTypes.string,
};

CartTotalLine.defaultProps = {
  children: null,
  className: null,
  isDisabled: false,
  type: null,
};

CartTotalLine.Label = Label;
CartTotalLine.Amount = Amount;
CartTotalLine.Hint = Hint;
CartTotalLine.Spacer = Spacer;

export default CartTotalLine;
