// @flow
import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import classnames from 'classnames';
import { i18n } from '@shopgate/engage/core';
import StopIcon from '@shopgate/pwa-ui-shared/icons/StopIcon';
import InfoIcon from '@shopgate/pwa-ui-shared/icons/InfoIcon';
import WarningIcon from '@shopgate/pwa-ui-shared/icons/WarningIcon';

import * as styles from './MessageBar.style';
import { type ClassNames, type Message } from './MessageBar.types';

type DefaultProps = {
  classNames: ClassNames,
};

type Props = DefaultProps & {
  messages: Message[],
  classNames?: ClassNames,
  raised?: boolean,
  showIcons?: boolean
};

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
}: Props) => {
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
          translated = false,
        } = item;

        let { icon: Icon = null } = item;

        if (Icon === null && showIcons) {
          Icon = iconMapping[type];
        }

        const messageOutput = !translated ? i18n.text(message, messageParams) : message;

        return (
          <div
            key={`${type}-${message}`}
            className={classnames(
              styles[type](),
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

export default hot(React.memo<Props>(MessageBar));
