import React, { useMemo } from 'react';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { FormBuilder, RippleButton } from '@shopgate/engage/components';
import { StylePresets } from '@shopgate/engage/components/Form';
import { useProfileContext } from './Profile.provider';
import generateFormConfig from './Profile.config';

const styles = {
  root: css({
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 16,
  }).toString(),
  form: css({
    ...StylePresets.OUTLINED_FORM_FIELDS,
    ...StylePresets.TWO_COLUMN_LAYOUT,
  }).toString(),
  button: css({
    '&&': {
      marginTop: 8,
      marginRight: 16,
      backgroundColor: 'var(--color-primary)',
      borderRadius: 5,
      fontSize: 14,
      textTransform: 'none',
      padding: 0,
      [responsiveMediaQuery('<md', { webOnly: false })]: {
        marginRight: 0,
      },
    },
  }).toString(),
  buttonDelete: css({
    '&&': {
      marginTop: 8,
      marginRight: 16,
      border: '1px solid var(--color-state-alert)',
      backgroundColor: '#fff',
      color: 'var(--color-state-alert)',
      borderRadius: 5,
      fontSize: 14,
      textTransform: 'none',
      padding: 0,
      [responsiveMediaQuery('<md', { webOnly: false })]: {
        marginRight: 0,
      },
    },
  }).toString(),
  ripple: css({
    padding: '8px 16px',
  }).toString(),
  actions: css({
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    [responsiveMediaQuery('<md', { webOnly: false })]: {
      marginTop: 8,
      flexDirection: 'column-reverse',
    },
  }).toString(),
};

/**
 * @returns {JSX}
 */
const ProfileForm = () => {
  const {
    formState, customer, saveForm, deleteCustomer,
  } = useProfileContext();

  const formConfig = useMemo(() => generateFormConfig(), []);

  if (!customer) {
    return null;
  }

  return (
    <div className={styles.root}>
      <FormBuilder
        name="ProfileForm"
        className={styles.form}
        config={formConfig}
        defaults={customer}
        validationErrors={[]}
        handleUpdate={formState.setValues}
      />
      <div className={styles.actions}>
        <RippleButton
          className={styles.buttonDelete}
          rippleClassName={styles.ripple}
          type="primary"
          onClick={deleteCustomer}
        >
          {i18n.text('account.profile.delete')}
        </RippleButton>
        <RippleButton
          className={styles.button}
          rippleClassName={styles.ripple}
          type="primary"
          onClick={saveForm}
        >
          {i18n.text('account.profile.form.save')}
        </RippleButton>
      </div>
    </div>
  );
};

export default ProfileForm;
