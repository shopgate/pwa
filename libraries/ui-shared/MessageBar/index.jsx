import React, { memo } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const useStyles = makeStyles()(() => {
  const messageBase = {
    padding: `${variables.gap.small}px ${variables.gap.big}px`,
    fontSize: '0.875rem',
    fontWeight: 500,
    '&:not(:last-child)': {
      marginBottom: variables.gap.small * 0.5,
    },
  };

  return {
    container: {
      background: colors.background,
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    },
    info: {
      ...messageBase,
      background: 'var(--color-secondary)',
      color: 'var(--color-secondary-contrast)',
    },
    error: {
      ...messageBase,
      background: colors.error,
      color: colors.light,
    },
    warning: {
      ...messageBase,
      background: colors.warning,
      color: colors.light,
    },
  };
});

/**
 * The MessageBar component.
 * @param {Object} props The component props.
 * @param {Array} props.messages The message content.
 * @param {Object} props.classNames Styling.
 * @returns {JSX}
 * @deprecated Please import from `@shopgate/engage/components` instead.
 */
const MessageBar = memo(({ messages, classNames: classNamesProp }) => {
  const { classes } = useStyles();

  return (
    <div
      className={classnames(classes.container, classNamesProp.container, 'ui-shared__message-bar')}
      role={messages.length > 0 ? 'alert' : null}
    >
      {messages.map((item) => {
        const {
          type = 'info',
          message,
          messageParams = null,
          translated,
        } = item;

        const messageOutput = !translated ? i18n.text(message, messageParams) : message;

        let typeClass = classes.info;
        if (type === 'error') {
          typeClass = classes.error;
        } else if (type === 'warning') {
          typeClass = classes.warning;
        }

        return (
          <div
            key={`${type}-${message}`}
            className={classnames(classNamesProp.message, typeClass)}
          >
            <span aria-hidden>
              {messageOutput}
            </span>
          </div>
        );
      })}
    </div>
  );
});

MessageBar.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string,
  })).isRequired,
  classNames: PropTypes.shape({
    container: PropTypes.string,
    message: PropTypes.string,
  }),
};

MessageBar.defaultProps = {
  classNames: {
    container: null,
    message: null,
  },
};

export default MessageBar;
