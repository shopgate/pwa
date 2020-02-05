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
const ErrorText = props => (
  <div className={classNames(props.className, styles.error, 'errorText')}>
    { props.translate && <I18n.Text string={props.validationError || props.errorText} /> }
    { !props.translate && (props.validationError || props.errorText) }
  </div>
);

ErrorText.propTypes = {
  className: PropTypes.string,
  errorText: PropTypes.string,
  translate: PropTypes.bool,
  validationError: PropTypes.string,
};

ErrorText.defaultProps = {
  className: '',
  errorText: null,
  translate: true,
  validationError: null,
};

export default ErrorText;

