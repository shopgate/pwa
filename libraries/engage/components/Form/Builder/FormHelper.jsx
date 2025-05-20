import React from 'react';
import PropTypes from 'prop-types';
import ErrorTextCmp from '@shopgate/pwa-ui-shared/FormElement/components/ErrorText';
import { SurroundPortals } from '@shopgate/engage/components';
import { sanitizePortalName } from './helpers/common';

/**
 * Component for error texts
 * @param {Object} props Component props.
 * @returns {JSX.Element}
 */
const FormHelper = ({
  errorText,
  element,
  formName,
  elementName,
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
      <ErrorTextCmp errorText={errorText} translate={false} elementName={elementName} />
      )}
    </SurroundPortals>
  </div>
);

FormHelper.propTypes = {
  element: PropTypes.shape().isRequired,
  formName: PropTypes.string.isRequired,
  elementName: PropTypes.string,
  errorText: PropTypes.string,
};

FormHelper.defaultProps = {
  errorText: null,
  elementName: null,
};

export default FormHelper;
