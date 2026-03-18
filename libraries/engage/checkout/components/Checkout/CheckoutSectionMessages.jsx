import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { errorBehavior } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  wrapper: {
    paddingTop: variables.gap.xsmall,
  },
  message: {
    fontSize: ' 0.75rem',
  },
  error: {
    color: 'var(--color-state-alert)',
  },
  warning: {
    color: 'var(--color-state-warning)',
  },
  info: {
    color: 'var(--color-state-ok)',
  },
});

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
