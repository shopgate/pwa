import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * Error message component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ErrorText = ({ className, error, errorText }) => (
  <div className={classNames(className, error)}>
    <I18n.Text string={errorText} />
  </div>
);

ErrorText.propTypes = {
  className: PropTypes.string,
  errorText: PropTypes.string,
};

ErrorText.defaultProps = {
  className: null,
  errorText: null,
};

export default ErrorText;

