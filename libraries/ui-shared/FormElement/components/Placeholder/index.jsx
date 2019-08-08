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
const Placeholder = ({ placeholder, visible, 'aria-hidden': ariaHidden }) => (
  <div className={styles.placeholderStyles(visible)} aria-hidden={ariaHidden}>
    <I18n.Text string={placeholder} />
  </div>
);

Placeholder.propTypes = {
  'aria-hidden': PropTypes.bool,
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  visible: PropTypes.bool,
};

Placeholder.defaultProps = {
  'aria-hidden': null,
  placeholder: '',
  visible: false,
};

export default Placeholder;
