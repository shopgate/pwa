import React, { useMemo, useCallback } from 'react';
import { FormBuilder } from '@shopgate/engage/components';
import { StylePresets } from '@shopgate/engage/components/Form';
import { makeStyles } from '@shopgate/engage/styles';
import generateFormConfig from './GuestCheckoutPickupNotes.config';
import Section from '../Checkout/CheckoutSection';
import { useCheckoutContext } from '../../hooks/common';

const useStyles = makeStyles()(theme => ({
  root: {
    padding: '16px 16px 0',
    paddingTop: 0,
    display: 'flex',
    flex: '0 0 auto',
    flexDirection: 'column',
  },
  form: {
    ' .textField': {
      marginBottom: '16px !important',
    },
    ...StylePresets.getOutlinedFormFields(theme),
  },
}));

/**
 * GuestCheckoutPickupNotes
 * @returns {JSX}
 */
const GuestCheckoutPickupNotes = () => {
  const { classes } = useStyles();
  const {
    defaultPickupPersonState,
    formValidationErrors,
    formSetValues,
    isPickupContactSelectionEnabled,
  } = useCheckoutContext();

  const formConfig = useMemo(
    () => generateFormConfig(),
    []
  );

  const handleUpdate = useCallback((values) => {
    formSetValues(values);
  }, [formSetValues]);

  if (!isPickupContactSelectionEnabled) {
    return null;
  }

  return (
    <div className={classes.root}>
      <Section title="" hasForm>
        <FormBuilder
          className={classes.form}
          name="PickupNotesForm"
          config={formConfig}
          defaults={defaultPickupPersonState}
          validationErrors={formValidationErrors}
          handleUpdate={handleUpdate}
        />
      </Section>
    </div>
  );
};

export default GuestCheckoutPickupNotes;
