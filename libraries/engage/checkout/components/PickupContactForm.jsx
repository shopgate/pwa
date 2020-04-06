import React from 'react';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import { themeConfig } from '@shopgate/engage';
import { FormBuilder } from '@shopgate/engage/components';

import generateFormConfig from './PickupContactForm.config';
import { useCheckoutContext } from '../hooks/common';

const { colors, variables } = themeConfig;

const styles = {
  root: css({
    padding: 16,
    display: 'flex',
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
      paddingBottom: 4,
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
      paddingBottom: 2,
      paddingTop: 2,
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

  return (
    <div className={styles.root}>
      <span className={styles.h1}>
        {i18n.text('checkout.pickup_contact.headline')}
      </span>
      <span className={styles.h2}>
        {i18n.text('checkout.pickup_contact.subheadline')}
      </span>
      <FormBuilder
        className={styles.form}
        name="PickupForm"
        config={formConfig}
        defaults={defaultPickupPersonState}
        validationErrors={formValidationErrors}
        handleUpdate={handleUpdate}
      />
    </div>
  );
};

export default PickupContactForm;
