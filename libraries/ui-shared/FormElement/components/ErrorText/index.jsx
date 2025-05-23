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
  className, errorText, translate, elementName, ariaHidden,
}) => (
  <div
    id={`ariaError-${elementName}`}
    className={classNames(className, styles, 'errorText')}
    aria-live="assertive"
    aria-atomic="true"
    aria-hidden={ariaHidden}
  >
    {translate && <I18n.Text string={errorText} />}
    {!translate && errorText}
  </div>
);

ErrorText.propTypes = {
  ariaHidden: PropTypes.bool,
  className: PropTypes.string,
  elementName: PropTypes.string,
  errorText: PropTypes.string,
  translate: PropTypes.bool,
};

ErrorText.defaultProps = {
  className: null,
  errorText: null,
  elementName: null,
  translate: true,
  ariaHidden: false,
};

export default ErrorText;
