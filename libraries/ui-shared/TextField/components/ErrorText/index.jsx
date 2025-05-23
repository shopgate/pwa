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
const ErrorText = ({
  elementName, validationError, errorText, ariaHidden, translate, className,
}) => (
  <div
    id={`ariaError-${elementName}`}
    className={classNames(className, styles.error, 'errorText')}
    aria-live="assertive"
    aria-atomic="true"
    aria-hidden={ariaHidden}
  >
    {translate && <I18n.Text string={validationError || errorText} />}
    {!translate && (validationError || errorText)}
  </div>
);

ErrorText.propTypes = {
  ariaHidden: PropTypes.bool,
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
  ariaHidden: false,
  validationError: null,
};

export default ErrorText;

