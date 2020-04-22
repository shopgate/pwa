import React, { useMemo, useCallback } from 'react';
import { FormBuilder } from '@shopgate/engage/components';
import { useRegistration } from '../../hooks';
import Section from '../../../checkout/components/Checkout/CheckoutSection';
import generateFormConfig from './RegistrationFormBase.config';
import { form, containerItem, section } from './Registration.style';

/**
 * The RegistrationFormBase component.
 * @returns {JSX}
 */
const RegistrationFormBase = () => {
  const {
    defaultBaseFormState,
    baseFormValidationErrors,
    updateBaseForm,
  } = useRegistration();

  const formConfig = useMemo(
    () => generateFormConfig(),
    []
  );

  const handleUpdate = useCallback((values) => {
    updateBaseForm(values);
  }, [updateBaseForm]);

  return (
    <div className={containerItem}>
      <Section title="registration.headlines.create_new_account" className={section}>
        <FormBuilder
          className={form}
          name="RegistrationBase"
          config={formConfig}
          defaults={defaultBaseFormState}
          validationErrors={baseFormValidationErrors}
          handleUpdate={handleUpdate}
        />
      </Section>
    </div>
  );
};

export default RegistrationFormBase;
