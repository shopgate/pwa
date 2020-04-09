import React from 'react';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/engage';
import { FormBuilder } from '@shopgate/engage/components';

import generateFormConfig from './CheckoutPickupContactForm.config';
import Section from './CheckoutSection';
import { useCheckoutContext } from '../../hooks/common';

const { colors, variables } = themeConfig;

const styles = {
  root: css({
    padding: 16,
    paddingTop: 0,
    display: 'flex',
    flex: '0 0 auto',
    flexDirection: 'column',
  }).toString(),
  h1: css({
    fontSize: 24,
    color: colors.dark,
    marginBottom: 4,
  }).toString(),
  h2: css({
    fontSize: 16,
    color: '#494949',
  }).toString(),
  form: css({
    ' .textField': {
      paddingBottom: 8,
    },
    ' .pickupFormPickupPerson': {
      marginTop: variables.gap.small,
    },
    ' .pickupFormPickupPerson .me': {
      marginRight: variables.gap.big,
    },
    ' .pickupFormPickupPerson .label span': {
      color: colors.dark,
      fontSize: 20,
      fontWeight: 'bold',
    },
    ' .pickupFormPickupPerson .radioGroup': {
      marginTop: variables.gap.small,
      flexDirection: 'row',
    },
    ' .phonePicker': {
      paddingTop: variables.gap.big,
    },
  }).toString(),
};

/**
 * PickupContactForm
 * @returns {JSX}
 */
const PickupContactForm = () => {
  const {
    supportedCountries,
    userLocation,
    defaultPickupPersonState,
    formValidationErrors,
    formSetValues,
  } = useCheckoutContext();

  const formConfig = React.useMemo(
    () => generateFormConfig(supportedCountries, userLocation),
    [supportedCountries, userLocation]
  );

  const handleUpdate = React.useCallback((values) => {
    formSetValues(values);
  }, [formSetValues]);

  // Whenever form validations come in we need to scroll to the right field.
  React.useEffect(() => {
    if (!formValidationErrors.length) {
      return;
    }

    const firstError = formValidationErrors[0].path;

    // TODO: FormBuilder should have that out of the box.
    const formElement = document
      .querySelector(
        `.pickupForm${firstError.charAt(0).toUpperCase()}${firstError.slice(1)} input`
      );

    // After switching the form fields are no longer rendered
    // due to the visible flag being manipulated.
    // Validations are triggered after that by the form builder.
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, [formValidationErrors]);

  return (
    <div className={styles.root}>
      <Section title="checkout.pickup_contact.headline">
        <FormBuilder
          className={styles.form}
          name="PickupForm"
          config={formConfig}
          defaults={defaultPickupPersonState}
          validationErrors={formValidationErrors}
          handleUpdate={handleUpdate}
        />
      </Section>
    </div>
  );
};

export default PickupContactForm;
