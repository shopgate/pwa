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
const ErrorText = ({ className, errorText, translate }) => (
  <div className={classNames(className, styles, 'errorText')}>
    {translate && <I18n.Text string={errorText} />}
    {!translate && errorText}
  </div>
);

ErrorText.propTypes = {
  className: PropTypes.string,
  errorText: PropTypes.string,
  translate: PropTypes.bool,
};

ErrorText.defaultProps = {
  className: null,
  errorText: null,
  translate: true,
};

export default ErrorText;
