// @flow
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
  classNames?: ClassNames
};

/**
 * The MessageBar component.
 * @param {Object} props The component props.
 * @param {Array} props.messages The message content.
 * @param {Object} props.classNames Styling.
 * @return {JSX}
 */
const MessageBar = ({ messages, classNames }: Props) => (
  <div
    className={css(styles.container, classNames.container)}
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
            classNames.message,
            styles[type],
            Icon ? styles.withIcon : null
          )}
        >
          {Icon && <Icon className={css(classNames.icon, styles.icon).toString()} /> }
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

MessageBar.defaultProps = {
  classNames: {
    container: null,
    message: null,
    icon: null,
  },
};

export default React.memo<Props>(MessageBar);
