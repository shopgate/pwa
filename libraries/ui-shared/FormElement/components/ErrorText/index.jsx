import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * Error message component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ErrorText = props => (
  <div className={`${props.className} ${styles.error}`}>
    <I18n.Text string={props.errorText} />
  </div>
);

ErrorText.propTypes = {
  className: PropTypes.string,
  errorText: PropTypes.string,
};

ErrorText.defaultProps = {
  className: '',
  errorText: null,
};

export default ErrorText;

