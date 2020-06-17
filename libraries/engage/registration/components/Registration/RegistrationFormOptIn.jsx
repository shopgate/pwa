import React, { useMemo, useCallback } from 'react';
import { FormBuilder } from '@shopgate/engage/components';
import { useRegistration } from '../../hooks';
import generateFormConfig from './RegistrationFormOptIn.config';
import { form } from './Registration.style';
/**
 * @returns {JSX}
 */
const RegistrationFormOptIn = () => {
  const {
    defaultOptInFormState,
    updateOptInForm,
  } = useRegistration();

  const formConfig = useMemo(
    () => generateFormConfig(),
    []
  );

  const handleUpdate = useCallback((values) => {
    updateOptInForm(values);
  }, [updateOptInForm]);

  return (
    <FormBuilder
      className={form}
      name="RegistrationOptIn"
      config={formConfig}
      defaults={defaultOptInFormState}
      handleUpdate={handleUpdate}
    />
  );
};

export default RegistrationFormOptIn;
