import I18n from '@shopgate/pwa-common/components/I18n';
import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * Message component.
 * @returns {function}
 */
const Message = ({ text }) => (
  <p className={styles.message}>
    <I18n.Text string={text} />
  </p>
);

Message.propTypes = {
  text: PropTypes.string,
};

Message.defaultProps = {
  text: null,
};

export default Message;
