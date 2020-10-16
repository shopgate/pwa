import React, { useMemo, useCallback } from 'react';
import { FormBuilder } from '@shopgate/engage/components';
import { useRegistration } from '../../hooks';
import generateFormConfig from './RegistrationFormExtra.config';
import { form } from './Registration.style';
/**
 * @returns {JSX}
 */
const RegistrationFormExtra = () => {
  const {
    defaultExtraFormState,
    updateExtraForm,
    customerAttributes,
  } = useRegistration();

  const formConfig = useMemo(
    () => generateFormConfig(customerAttributes),
    [customerAttributes]
  );

  const handleUpdate = useCallback((values) => {
    updateExtraForm(values);
  }, [updateExtraForm]);

  return (
    <FormBuilder
      className={form}
      name="RegistrationExtra"
      config={formConfig}
      defaults={defaultExtraFormState}
      handleUpdate={handleUpdate}
    />
  );
};

export default RegistrationFormExtra;
