import React, { useMemo, useCallback, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import {
  i18n, useRoute, historyPop, getNumberOfAddressLines,
} from '@shopgate/engage/core';
import { convertValidationErrors, useFormState } from '@shopgate/engage/core/hooks/useFormState';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { getShopSettings } from '@shopgate/engage/core/config';
import { getPreferredLocationAddress } from '@shopgate/engage/locations/selectors';

import { FormBuilder, RippleButton } from '@shopgate/engage/components';
import { StylePresets } from '@shopgate/engage/components/Form';
import { LoadingProvider } from '@shopgate/pwa-common/providers';
import { useAddressBook } from '@shopgate/engage/checkout';
import { generateFormConfig } from './ProfileContact.config';
import { generateConstraints } from './ProfileContact.constraints';
import { addCustomerContacts } from '../../actions/addContacts';
import { getCustomer } from '../../selectors/customer';
import { updateCustomerContact } from '../../actions/updateContact';

/**
 * @param {Object} state State
 * @returns {Object}
 */
const mapStateToProps = state => ({
  shopSettings: getShopSettings(state),
  userLocation: getPreferredLocationAddress(state),
  customer: getCustomer(state),
  numberOfAddressLines: getNumberOfAddressLines(state),
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
      flex: 1,
    },
  }).toString(),
};

/**
 * @param {Object} props Props.
 * @returns {JSX}
 */
const ProfileContact = ({
  shopSettings, userLocation, addContact, updateContact, pop, customer, numberOfAddressLines,
}) => {
  const { updateOrderWithContact, type, isCheckout } = useAddressBook();
  const formContainerRef = useRef(null);
  const { pathname, state: { contact = {} } } = useRoute();

  const addressLines = useMemo(() => {
    /**
     * Determine the number of address fields with a value. Customers are supposed to edit their
     * old addresses after the numberOfAddressLines shop setting was changed.
     */
    const addressLinesInContact = Object.keys(contact).reduce((acc, key) => {
      if (key.startsWith('address') && contact[key]) {
        return parseInt(key.charAt(key.length - 1), 10);
      }

      return acc;
    }, 0);

    return Math.max(numberOfAddressLines, addressLinesInContact);
  }, [contact, numberOfAddressLines]);

  const formConfig = useMemo(() => generateFormConfig(
    shopSettings?.supportedCountries,
    userLocation,
    isCheckout,
    type,
    addressLines
  ), [addressLines, isCheckout, shopSettings, type, userLocation]);

  const constraints = useMemo(() => generateConstraints(isCheckout), [isCheckout]);

  const handleSubmit = useCallback(async (values) => {
    LoadingProvider.setLoading(pathname);
    let contactId = contact.id;

    const finalValues = {
      ...values,
      ...(isCheckout && !contact?.emailAddress ? {
        emailAddress: customer?.emailAddress,
      } : {}),
    };

    const fieldsUpdated = Object.keys(values)
      .filter(key => !['isDefaultBilling', 'isDefaultShipping'].includes(key))
      .some(key => values[key] !== contact[key]);

    try {
      if (contact?.id) {
        await updateContact(contact.id, finalValues);
      } else {
        ({ contactIds: [contactId] } = await addContact(finalValues));
      }

      if (updateOrderWithContact && fieldsUpdated) {
        await updateOrderWithContact(contactId);
        return;
      }

      pop();
    } catch (error) {
      // Generic error handling is used.
    }

    LoadingProvider.unsetLoading(pathname);
  }, [
    addContact,
    contact,
    customer,
    isCheckout,
    pathname,
    pop,
    updateContact,
    updateOrderWithContact,
  ]);

  const formState = useFormState(contact, handleSubmit, constraints, formContainerRef);
  const validationErrors = useMemo(() =>
    convertValidationErrors(formState.validationErrors || {}),
  [formState.validationErrors]);

  /* eslint-disable react-hooks/exhaustive-deps */
  const handleUpdate = useCallback((values) => {
    formState.setValues(values);
  }, [formState.setValues]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <div className={styles.root} ref={formContainerRef}>
      <FormBuilder
        name="ProfileAddressForm"
        className={styles.form}
        config={formConfig}
        defaults={contact}
        validationErrors={validationErrors}
        handleUpdate={handleUpdate}
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
  customer: PropTypes.shape(),
  numberOfAddressLines: PropTypes.number,
};

ProfileContact.defaultProps = {
  customer: null,
  numberOfAddressLines: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContact);
