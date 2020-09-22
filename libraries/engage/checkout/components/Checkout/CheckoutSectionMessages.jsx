import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { css } from 'glamor';
import { errorBehavior } from '@shopgate/engage/core';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const styles = {
  wrapper: css({
    paddingTop: variables.gap.xsmall,
  }).toString(),
  message: css({
    fontSize: ' 0.75rem',
  }).toString(),
  error: css({
    color: 'var(--color-state-alert)',
  }).toString(),
  warning: css({
    color: 'var(--color-state-warning)',
  }).toString(),
  info: css({
    color: 'var(--color-state-ok)',
  }).toString(),
};

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const CheckoutSectionMessages = ({ messages }) => {
  if (!Array.isArray(messages) || messages.length === 0) {
    return null;
  }

  return (
    <ul className={styles.wrapper}>
      {messages.map(({ message, additionalParams, type }) => (
        <li
          key={message}
          className={classNames(styles.message, {
            [styles.error]: type === 'error',
            [styles.warning]: type === 'warning',
            [styles.info]: type === 'info',
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
