import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const useStyles = makeStyles()((theme) => {
  const messageBase = {
    padding: theme.spacing(1, 2),
    fontSize: '0.875rem',
    fontWeight: 500,
    '&:not(:last-child)': {
      marginBottom: theme.spacing(0.5),
    },
  };

  return {
    container: {
      background: theme.palette.background.default,
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
      background: theme.palette.error.main,
      color: colors.light,
    },
    warning: {
      ...messageBase,
      background: theme.palette.warning.main,
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
  const { classes, cx } = useStyles();

  return (
    <div
      className={cx(classes.container, classNamesProp.container, 'ui-shared__message-bar')}
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
            className={cx(classNamesProp.message, typeClass)}
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
