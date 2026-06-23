import React, { useMemo, useCallback } from 'react';
import { FormBuilder } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { StylePresets } from '@shopgate/engage/components/Form';
import { useRegistration } from '../../hooks';
import Section from '../../../checkout/components/Checkout/CheckoutSection';
import generateFormConfig from './RegistrationFormBase.config';

const useStyles = makeStyles()(theme => ({
  form: {
    ...StylePresets.getOutlinedFormFields(theme),
    ' .registrationOptInMarketingOptIn': {
      paddingTop: 0,
      paddingBottom: theme.spacing(2),
    },
  },
  section: {},
}));

/**
 * The RegistrationFormBase component.
 * @returns {JSX}
 */
const RegistrationFormBase = () => {
  const { classes } = useStyles();
  const {
    defaultBaseFormState,
    baseFormValidationErrors,
    updateBaseForm,
    registrationMode,
  } = useRegistration();

  const formConfig = useMemo(
    () => generateFormConfig({ registrationMode }),
    [registrationMode]
  );

  const handleUpdate = useCallback((values) => {
    updateBaseForm(values);
  }, [updateBaseForm]);

  return (
    <Section title="registration.headlines.create_new_account" className={classes.section} hasForm>
      <FormBuilder
        className={classes.form}
        name="RegistrationBase"
        config={formConfig}
        defaults={defaultBaseFormState}
        validationErrors={baseFormValidationErrors}
        handleUpdate={handleUpdate}
      />
    </Section>
  );
};

export default RegistrationFormBase;
