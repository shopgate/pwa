import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { I18n } from '@shopgate/engage/components';
import styles from './style';

/**
 * Error message component.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const ErrorText = props => (
  <div
    id={`ariaError-${props.elementName}`}
    className={classNames(props.className, styles.error, 'errorText')}
    aria-live="assertive"
    aria-atomic="true"
    aria-hidden
  >
    {props.translate && <I18n.Text string={props.validationError || props.errorText} />}
    {!props.translate && (props.validationError || props.errorText)}
  </div>
);

ErrorText.propTypes = {
  className: PropTypes.string,
  elementName: PropTypes.string,
  errorText: PropTypes.string,
  translate: PropTypes.bool,
  validationError: PropTypes.string,
};

ErrorText.defaultProps = {
  className: '',
  errorText: null,
  elementName: null,
  translate: true,
  validationError: null,
};

export default ErrorText;

