import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { StylePresets } from '@shopgate/engage/components/Form';
import Section from '../../../checkout/components/Checkout/CheckoutSection';
import { useRegistration } from '../../hooks';
import { ELEMENT_ID_CUSTOMER_ATTRIBUTES } from '../../constants';
import generateFormConfig from './RegistrationFormExtra.config';

const useStyles = makeStyles()(theme => ({
  form: {
    ...StylePresets.OUTLINED_FORM_FIELDS,
    ' .registrationOptInMarketingOptIn': {
      paddingTop: 0,
      paddingBottom: theme.spacing(2),
    },
  },
  section: {},
}));

/**
 * The RegistrationFormExtra component.
 * @param {Object} props The component props
 * @returns {JSX}
 */
const RegistrationFormExtra = ({ isGuest }) => {
  const { classes } = useStyles();
  const {
    defaultExtraFormState,
    updateExtraForm,
    customerAttributes,
    extraFormValidationErrors,
    supportedCountries,
    countrySortOrder,
    userLocation,
  } = useRegistration(isGuest);

  const formConfig = useMemo(
    () => generateFormConfig({
      customerAttributes,
      isGuest,
      supportedCountries,
      countrySortOrder,
      userLocation,
    }),
    [countrySortOrder, customerAttributes, isGuest, supportedCountries, userLocation]
  );

  const handleUpdate = useCallback((values) => {
    updateExtraForm(values);
  }, [updateExtraForm]);

  return (
    <Section className={classes.section} hasForm id={ELEMENT_ID_CUSTOMER_ATTRIBUTES}>
      <FormBuilder
        className={classes.form}
        name="RegistrationExtra"
        config={formConfig}
        defaults={defaultExtraFormState}
        validationErrors={extraFormValidationErrors}
        handleUpdate={handleUpdate}
      />
    </Section>
  );
};

RegistrationFormExtra.propTypes = {
  isGuest: PropTypes.bool,
};

RegistrationFormExtra.defaultProps = {
  isGuest: false,
};

export default RegistrationFormExtra;
