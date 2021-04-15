import React, { useMemo, useCallback } from 'react';
import { css } from 'glamor';
import { FormBuilder } from '@shopgate/engage/components';
import { StylePresets } from '@shopgate/engage/components/Form';
import generateFormConfig from './GuestCheckoutPickupNotes.config';
import Section from '../Checkout/CheckoutSection';
import { useCheckoutContext } from '../../hooks/common';

const styles = {
  root: css({
    padding: '16px 16px 0',
    paddingTop: 0,
    display: 'flex',
    flex: '0 0 auto',
    flexDirection: 'column',
  }).toString(),
  form: css({
    ' .textField': {
      marginBottom: '16px !important',
    },
    ...StylePresets.OUTLINED_FORM_FIELDS,
  }).toString(),
};

/**
 * GuestCheckoutPickupNotes
 * @returns {JSX}
 */
const GuestCheckoutPickupNotes = () => {
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
    <div className={styles.root}>
      <Section title="" hasForm>
        <FormBuilder
          className={styles.form}
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
