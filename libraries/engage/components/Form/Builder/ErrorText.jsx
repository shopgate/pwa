import React from 'react';
import PropTypes from 'prop-types';
import ErrorTextCmp from '@shopgate/pwa-ui-shared/FormElement/components/ErrorText';

/**
 * Component for error texts
 * @param {Object} props Component props.
 * @returns {JSX}
 */
const ErrorText = ({
  errorText,
}) => (
  <div className="errorContainer">
    {!!errorText && (
    <ErrorTextCmp errorText={errorText} translate={false} />
    )}
  </div>
);

ErrorText.propTypes = {
  errorText: PropTypes.string,
};

ErrorText.defaultProps = {
  errorText: null,
};

export default ErrorText;
