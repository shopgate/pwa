// @flow
import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import * as styles from './MessageBar.style';
import { type ClassNames, type Message } from './MessageBar.types';

type DefaultProps = {
  classNames: ClassNames,
};

type Props = DefaultProps & {
  messages: Message[],
  classNames?: ClassNames,
  raised?: boolean,
};

/**
 * The MessageBar component.
 * @param {Object} props The component props.
 * @property {Array} props.messages The message content.
 * @property {Object} props.classNames Styling.
 * @return {JSX}
 */
const MessageBar = ({ messages, classNames, raised }: Props) => {
  const containerClass = React.useMemo<string>(() => {
    if (raised) {
      return css(styles.containerRaised, classNames.containerRaised).toString();
    }

    return css(styles.container, classNames.container).toString();
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
          icon: Icon = null,
        } = item;

        const messageOutput = !translated ? i18n.text(message, messageParams) : message;

        return (
          <div
            key={`${type}-${message}`}
            className={css(
              styles[type],
              classNames.message,
              Icon ? styles.withIcon : null
            )}
          >
            {Icon && (
              <Icon className={css(classNames.icon, styles.icon).toString()} />
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
    message: null,
    icon: null,
  },
  raised: false,
};

export default hot(React.memo<Props>(MessageBar));
