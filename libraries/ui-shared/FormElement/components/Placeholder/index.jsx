import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * The form element placeholder component.
 * @param {string} placeholder The placeholder text.
 * @param {boolean} visible Sets the placeholder visibility.
 * @return {JSX}
 */
const Placeholder = ({ placeholder, visible }) => (
  <div className={styles.placeholderStyles(visible)}>
    <I18n.Text string={placeholder} />
  </div>
);

Placeholder.propTypes = {
  placeholder: PropTypes.string,
  visible: PropTypes.bool,
};

Placeholder.defaultProps = {
  placeholder: '',
  visible: false,
};

export default Placeholder;
