import React from 'react';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/engage';
import { FormBuilder } from '@shopgate/engage/components';
import { StylePresets } from '@shopgate/engage/components/Form';
import generateFormConfig from './CheckoutPickupContactForm.config';
import Section from './CheckoutSection';
import { useCheckoutContext } from '../../hooks/common';

const { variables } = themeConfig;

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
    marginBottom: 4,
    color: 'var(--color-text-high-emphasis)',
  }).toString(),
  h2: css({
    fontSize: 16,

  }).toString(),
  form: css({
    ' .pickupFormPickupPerson': {
      marginTop: variables.gap.small,
    },
    ' .pickupFormPickupPerson .me': {
      marginRight: variables.gap.big,
    },
    ' .pickupFormPickupPerson .label span': {
      color: 'var(--color-text-high-emphasis)',
      fontSize: 20,
      fontWeight: 'bold',
    },
    ' .pickupFormPickupPerson .radioGroup': {
      marginTop: variables.gap.small,
      flexDirection: 'row',
      ' .uncheckedIcon': {
        color: 'var(--color-text-medium-emphasis)',
      },
    },
    ...StylePresets.OUTLINED_FORM_FIELDS,
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

  return (
    <div className={styles.root}>
      <Section title="checkout.pickup_contact.headline" hasForm>
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
