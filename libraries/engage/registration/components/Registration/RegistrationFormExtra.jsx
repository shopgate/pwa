import React, { useMemo, useCallback } from 'react';
import { FormBuilder } from '@shopgate/engage/components';
import Section from '../../../checkout/components/Checkout/CheckoutSection';
import { useRegistration } from '../../hooks';
import generateFormConfig from './RegistrationFormExtra.config';
import { form, section } from './Registration.style';
/**
 * @returns {JSX}
 */
const RegistrationFormExtra = () => {
  const {
    defaultExtraFormState,
    updateExtraForm,
    customerAttributes,
    extraFormRequestErrors,
  } = useRegistration();

  const formConfig = useMemo(
    () => generateFormConfig(customerAttributes),
    [customerAttributes]
  );

  const handleUpdate = useCallback((values) => {
    updateExtraForm(values);
  }, [updateExtraForm]);

  return (
    <Section className={section} hasForm>
      <FormBuilder
        className={form}
        name="RegistrationExtra"
        config={formConfig}
        defaults={defaultExtraFormState}
        validationErrors={extraFormRequestErrors}
        handleUpdate={handleUpdate}
      />
    </Section>
  );
};

export default RegistrationFormExtra;
