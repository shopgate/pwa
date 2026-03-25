import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';
import Label from './components/Label';
import Amount from './components/Amount';
import Hint from './components/Hint';
import Spacer from './components/Spacer';

const { colors } = themeConfig;

const useStyles = makeStyles()({
  line: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.875rem',
    alignItems: 'baseline',
  },
  disabled: {
    color: `${colors.shade4} !important`,
  },
  base: {
    color: colors.shade9,
  },
  subTotal: {
    color: `${colors.dark}`,
  },
  grandTotal: {
    color: `${colors.dark}`,
    fontSize: '1rem !important',
  },
});

/**
 * @returns {JSX}
 */
const CartTotalLine = ({
  children, type, isDisabled, className,
}) => {
  const { classes } = useStyles();

  if (!children) {
    return null;
  }

  let typeClass = classes.base;
  if (type === 'subTotal') {
    typeClass = classes.subTotal;
  } else if (type === 'grandTotal') {
    typeClass = classes.grandTotal;
  }

  return (
    <div
      className={classNames(
        className,
        `ui-shared__cart-total-line ui-shared__cart-${type}-line`,
        classes.line,
        {
          [classes.disabled]: isDisabled,
          [typeClass]: true,
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
