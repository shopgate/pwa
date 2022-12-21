import React from 'react';
import PropTypes from 'prop-types';
import ErrorTextCmp from '@shopgate/pwa-ui-shared/FormElement/components/ErrorText';
import { SurroundPortals } from '@shopgate/engage/components';
import { sanitizePortalName } from './helpers/common';

/**
 * Component for error texts
 * @param {Object} props Component props.
 * @returns {JSX}
 */
const FormHelper = ({
  errorText,
  element,
  formName,
}) => (
  <div className="formHelper">
    <SurroundPortals
      portalName={`${sanitizePortalName(formName)}.${sanitizePortalName(element.id)}.formHelper`}
      portalProps={{
        formName,
        element,
        errorText,
      }}
    >
      {!!errorText && (
      <ErrorTextCmp errorText={errorText} translate={false} />
      )}
    </SurroundPortals>
  </div>
);

FormHelper.propTypes = {
  element: PropTypes.shape().isRequired,
  formName: PropTypes.string.isRequired,
  errorText: PropTypes.string,
};

FormHelper.defaultProps = {
  errorText: null,
};

export default FormHelper;
