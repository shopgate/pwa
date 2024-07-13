import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { i18n, errorBehavior } from '@shopgate/engage/core';
import StopIcon from '@shopgate/pwa-ui-shared/icons/StopIcon';
import InfoIcon from '@shopgate/pwa-ui-shared/icons/InfoIcon';
import WarningIcon from '@shopgate/pwa-ui-shared/icons/WarningIcon';

import * as styles from './MessageBar.style';

const iconMapping = {
  info: InfoIcon,
  warning: WarningIcon,
  error: StopIcon,
};

/**
 * The MessageBar component.
 * @param {Object} props The component props.
 * @property {Array} props.messages The message content.
 * @property {Object} props.classNames Styling.
 * @return {JSX}
 */
const MessageBar = ({
  messages, classNames, raised, showIcons,
}) => {
  const containerClass = React.useMemo<string>(() => {
    if (raised) {
      return classnames(styles.containerRaised, classNames.containerRaised);
    }

    return classnames(styles.container, classNames.container);
  }, [classNames.container, classNames.containerRaised, raised]);

  return (
    <div
      className={containerClass}
      role={messages.length > 0 ? 'alert' : null}
    >
      {messages.map((item) => {
        const {
          type = 'info',
          message,
          messageParams = null,
          additionalParams = null,
          translated = false,
        } = item;

        let { icon: Icon = null } = item;

        if (Icon === null && showIcons) {
          Icon = iconMapping[type];
        }

        const messageOutput = !translated
          ? errorBehavior.getErrorMessage(message, messageParams || additionalParams)
          : message;

        return (
          <div
            key={`${type}-${message}`}
            className={classnames(
              (styles[type] ? styles[type]() : null),
              classNames.message,
              Icon ? styles.withIcon : null
            )}
          >
            {Icon && (
              <Icon className={classnames(classNames.icon, styles.icon)} />
            )}
            <span className={styles.srOnly}>
              {`${i18n.text(`cart.message_type_${type}`)}: ${messageOutput}`}
            </span>
            <span aria-hidden className={Icon ? styles.messageToIcon : null}>
              {messageOutput}
            </span>
          </div>
        );
      })}
    </div>
  );
};

MessageBar.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string,
  })).isRequired,
  classNames: PropTypes.shape({
    container: PropTypes.string,
    containerRaised: PropTypes.string,
    message: PropTypes.string,
    icon: PropTypes.string,
  }),
  raised: PropTypes.bool,
  showIcons: PropTypes.bool,
};

MessageBar.defaultProps = {
  classNames: {
    container: null,
    containerRaised: null,
    message: null,
    icon: null,
  },
  raised: false,
  showIcons: false,
};

export default hot(React.memo(MessageBar));
