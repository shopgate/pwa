import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { errorBehavior } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  wrapper: {
    paddingTop: theme.spacing(0.5),
  },
  message: {
    fontSize: ' 0.75rem',
  },
  error: {
    color: theme.palette.error.main,
  },
  warning: {
    color: theme.palette.warning.main,
  },
  info: {
    color: theme.palette.success.main,
  },
}));

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const CheckoutSectionMessages = ({ messages }) => {
  const { classes } = useStyles();

  if (!Array.isArray(messages) || messages.length === 0) {
    return null;
  }

  return (
    <ul className={classes.wrapper}>
      {messages.map(({ message, additionalParams, type }) => (
        <li
          key={message}
          className={classNames(classes.message, {
            [classes.error]: type === 'error',
            [classes.warning]: type === 'warning',
            [classes.info]: type === 'info',
          })}
        >
          {errorBehavior.getErrorMessage(message, additionalParams)}
        </li>
      ))}
    </ul>
  );
};

CheckoutSectionMessages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape()),
};

CheckoutSectionMessages.defaultProps = {
  messages: null,
};

export default CheckoutSectionMessages;
