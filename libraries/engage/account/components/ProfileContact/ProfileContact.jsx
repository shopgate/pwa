import React, { useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { i18n, useRoute, historyPop } from '@shopgate/engage/core';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { getShopSettings } from '@shopgate/engage/core/config';
import { getPreferredLocationAddress } from '@shopgate/engage/locations/selectors';
import { useFormState } from '@shopgate/engage/core/hooks/useFormState';
import { FormBuilder, RippleButton } from '@shopgate/engage/components';
import { StylePresets } from '@shopgate/engage/components/Form';
import { LoadingProvider } from '@shopgate/pwa-common/providers';
import { generateFormConfig } from './ProfileContact.config';
import constraints from './ProfileContact.constraints';
import { addCustomerContacts } from '../../actions/addContacts';
import { updateCustomerContact } from '../../actions/updateContact';

/**
 * @param {Object} state State
 * @returns {Object}
 */
const mapStateToProps = state => ({
  shopSettings: getShopSettings(state),
  userLocation: getPreferredLocationAddress(state),
});

/**
 * @param {Object} dispatch Dispatch
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  pop: props => dispatch(historyPop(props)),
  addContact: contact => dispatch(addCustomerContacts({ contacts: [contact] })),
  updateContact: (contactId, contact) => dispatch(updateCustomerContact({
    contactId,
    contact,
  })),
});

const styles = {
  root: css({
    margin: 16,
  }),
  form: css({
    ...StylePresets.OUTLINED_FORM_FIELDS,
    ...StylePresets.TWO_COLUMN_LAYOUT,
    ' .profileAddressFormRegion': {
      [responsiveMediaQuery('>=md', { webOnly: false })]: {
        marginRight: '50%',
      },
    },
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
        width: '100%',
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
      flex: 1,
    },
  }).toString(),
};

/**
 * Converts validation errors into errors for form builder.
 * @param {Object} validationErrors The validation errors.
 * @returns {Array}
 */
const convertValidationErrors = validationErrors => Object
  .keys(validationErrors)
  .map(key => ({
    path: key,
    message: i18n.text(validationErrors[key]),
  }));

/**
 * @param {Object} props Props.
 * @returns {JSX}
 */
const ProfileContact = ({
  shopSettings, userLocation, addContact, updateContact, pop,
}) => {
  const formConfig = useMemo(() => generateFormConfig(
    shopSettings?.supportedCountries,
    userLocation
  ), [shopSettings, userLocation]);

  const { pathname, state: { contact = {} } } = useRoute();

  const handleSubmit = useCallback(async (values) => {
    LoadingProvider.setLoading(pathname);
    try {
      if (contact?.id) {
        await updateContact(contact.id, values);
      } else {
        await addContact(values);
      }
      pop();
    } catch (error) {
      // Generic error handling is used.
    }

    LoadingProvider.unsetLoading(pathname);
  }, [addContact, contact, pathname, pop, updateContact]);

  const formState = useFormState(contact, handleSubmit, constraints);
  const validationErrors = useMemo(() =>
    convertValidationErrors(formState.validationErrors || {}),
  [formState.validationErrors]);

  return (
    <div className={styles.root}>
      <FormBuilder
        name="ProfileAddressForm"
        className={styles.form}
        config={formConfig}
        defaults={contact}
        validationErrors={validationErrors}
        handleUpdate={formState.setValues}
      />
      <div className={styles.actions}>
        <RippleButton
          className={styles.button}
          rippleClassName={styles.ripple}
          type="primary"
          onClick={formState.handleSubmit}
        >
          {i18n.text('account.profile.form.save')}
        </RippleButton>
      </div>
    </div>
  );
};

ProfileContact.propTypes = {
  addContact: PropTypes.func.isRequired,
  pop: PropTypes.func.isRequired,
  shopSettings: PropTypes.shape().isRequired,
  updateContact: PropTypes.func.isRequired,
  userLocation: PropTypes.shape().isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContact);
