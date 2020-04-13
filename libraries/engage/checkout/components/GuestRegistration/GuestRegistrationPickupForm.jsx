import React from 'react';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/engage';
import { FormBuilder } from '@shopgate/engage/components';

import generateFormConfig from './GuestRegistrationPickupForm.config';
import Section from '../Checkout/CheckoutSection';
import { useGuestRegistration } from '../../hooks/common';

const { colors, variables } = themeConfig;

const styles = {
  root: css({
    padding: 16,
    display: 'flex',
    flex: '0 0 auto',
    flexDirection: 'column',
  }).toString(),
  form: css({
    ' .textField': {
      paddingBottom: 8,
    },
    ' .guestFormPickupPerson': {
      marginTop: variables.gap.small,
    },
    ' .guestFormPickupPerson .me': {
      marginRight: variables.gap.big,
    },
    ' .guestFormPickupPerson .label span': {
      color: colors.dark,
      fontSize: 20,
      fontWeight: 'bold',
    },
    ' .guestFormPickupPerson .radioGroup': {
      marginTop: variables.gap.small,
      flexDirection: 'row',
    },
    ' .phonePicker': {
      paddingTop: variables.gap.big,
      paddingBottom: 2,
    },
    ' .placeholder': {
      color: colors.shade12,
    },
  }).toString(),
};

/**
 * PickupContactForm
 * @returns {JSX}
 */
const GuestRegistrationForm = () => {
  const {
    supportedCountries,
    userLocation,
    defaultPickupPersonState,
    formPickupValidationErrors,
    formPickupSetValues,
  } = useGuestRegistration();

  const formConfig = React.useMemo(
    () => generateFormConfig(supportedCountries, userLocation),
    [supportedCountries, userLocation]
  );

  const handleUpdate = React.useCallback((values) => {
    formPickupSetValues(values);
  }, [formPickupSetValues]);

  return (
    <div className={styles.root}>
      <Section title="checkout.pickup_contact.headline">
        <FormBuilder
          className={styles.form}
          name="GuestForm"
          config={formConfig}
          defaults={defaultPickupPersonState}
          validationErrors={formPickupValidationErrors}
          handleUpdate={handleUpdate}
        />
      </Section>
    </div>
  );
};

export default GuestRegistrationForm;
