import React, {
  createContext, useMemo, useEffect, useContext, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useRoute, i18n, historyPush } from '@shopgate/engage/core';
import { getMerchantCustomerAttributes } from '@shopgate/engage/core/selectors/merchantSettings';
import { useFormState as useForm, convertValidationErrors } from '@shopgate/engage/core/hooks/useFormState';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { LoadingProvider, ToastProvider } from '@shopgate/pwa-common/providers';
import UIEvents from '@shopgate/pwa-core/emitters/ui';
import { PROFILE_ADDRESS_PATH } from '../../constants/routes';
import { fetchCustomerContacts } from '../../actions/fetchContacts';
import { fetchCustomerData } from '../../actions/fetchCustomer';
import { updateCustomerData } from '../../actions/updateCustomer';
import { deleteCustomerContact } from '../../actions/deleteContact';
import { deleteCustomer as deleteCustomerAction } from '../../actions/deleteCustomer';
import { getContacts } from '../../selectors/contacts';
import { getCustomer } from '../../selectors/customer';
import { extractAttributes } from '../../helper/form';
import createConstraints from './Profile.constraints';

const ProfileContext = createContext();

/**
 * @returns {Array}
 */
export const useProfileContext = () => useContext(ProfileContext);

/**
 * @param {Object} state State.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  contacts: getContacts(state),
  customer: getCustomer(state),
  merchantCustomerAttributes: getMerchantCustomerAttributes(state),
});

/**
 * @param {Function} dispatch Dispatch.
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  fetchContacts: () => dispatch(fetchCustomerContacts()),
  deleteContact: customerId => dispatch(deleteCustomerContact(customerId)),
  deleteCustomer: () => dispatch(deleteCustomerAction()),
  fetchCustomer: () => dispatch(fetchCustomerData()),
  updateCustomer: customer => dispatch(updateCustomerData(customer)),
  showDialog: props => dispatch(showModal(props)),
  push: props => dispatch(historyPush(props)),
});

/**
 * @returns {JSX}
 */
const ProfileProvider = ({
  fetchContacts,
  deleteContact,
  fetchCustomer,
  updateCustomer,
  deleteCustomer,
  push,
  showDialog,
  contacts,
  customer,
  merchantCustomerAttributes,
  children,
}) => {
  // Route
  const { pathname } = useRoute();

  // Default state.
  const defaultState = useMemo(() => (customer ? {
    ...customer,
    marketingOptIn: customer.settings.marketingOptIn || false,
    ...Object.assign({}, ...customer.attributes
      .map(attribute => ({ [`attribute_${attribute.code}`]: attribute.value?.code || attribute.value }))),
  } : null), [customer]);

  // Saving the form.
  const saveForm = useCallback(async (values) => {
    LoadingProvider.setLoading(pathname);
    try {
      await updateCustomer({
        firstName: values.firstName,
        ...(values.middleName ? {
          middleName: values.middleName,
        } : {}),
        lastName: values.lastName,
        emailAddress: values.emailAddress,
        settings: {
          marketingOptIn: values.marketingOptIn,
        },
        attributes: extractAttributes(merchantCustomerAttributes, values),
      });

      await fetchCustomer();

      UIEvents.emit(ToastProvider.ADD, {
        id: 'account.profile.form.success',
        message: 'account.profile.form.success',
      });
    } catch (error) {
      UIEvents.emit(ToastProvider.ADD, {
        id: 'account.profile.form.error',
        message: 'account.profile.form.error',
      });
    }
    LoadingProvider.unsetLoading(pathname);
  }, [fetchCustomer, merchantCustomerAttributes, pathname, updateCustomer]);

  // Hold profile form state.
  const constraints = useMemo(
    () => createConstraints(merchantCustomerAttributes),
    [merchantCustomerAttributes]
  );
  const formState = useForm(
    defaultState,
    saveForm,
    constraints
  );
  const validationErrors = useMemo(() =>
    convertValidationErrors(formState.validationErrors || {}),
  [formState.validationErrors]);

  /**
   * Executes callback with confirmation beforehand.
   * @param {string} message String
   */
  const confirmation = async (message) => {
    const confirmed = await showDialog({
      title: i18n.text('account.profile.confirm.title'),
      message: i18n.text(message),
      confirm: i18n.text('account.profile.confirm.confirm'),
    });
    return !!confirmed;
  };

  // Deletes a contact.
  /* eslint-disable react-hooks/exhaustive-deps */
  const deleteContactWrapper = useCallback(async (contactId) => {
    if (!await confirmation('account.profile.confirm.messageContact')) {
      return;
    }

    LoadingProvider.setLoading(pathname);
    try {
      await deleteContact(contactId);
      await fetchContacts();
    } catch (error) {
      // taken care by regular error handling.
    }
    LoadingProvider.unsetLoading(pathname);
  }, [deleteContact, fetchContacts, pathname]);

  const deleteCustomerWrapper = useCallback(async () => {
    if (!await confirmation('account.profile.confirm.messageCustomer')) {
      return;
    }

    LoadingProvider.setLoading(pathname);
    try {
      await deleteCustomer();
    } catch (error) {
      // taken care by regular error handling.
    }
    LoadingProvider.unsetLoading(pathname);
  }, [deleteContact, fetchContacts, pathname]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const editContact = useCallback((contact) => {
    push({
      pathname: PROFILE_ADDRESS_PATH,
      state: {
        contact,
      },
    });
  }, [push]);

  // Store context value.
  const contextValue = useMemo(() => ({
    contacts,
    validationErrors,
    merchantCustomerAttributes,
    customer: defaultState,
    formState,
    saveForm: formState.handleSubmit,
    editContact,
    deleteContact: deleteContactWrapper,
    deleteCustomer: deleteCustomerWrapper,
  }), [
    contacts,
    merchantCustomerAttributes,
    defaultState,
    deleteContactWrapper,
    deleteCustomerWrapper,
    editContact,
    formState,
    validationErrors,
  ]);

  // Fetch all required data for the profile page.
  useEffect(() => {
    fetchContacts();
    fetchCustomer();
  }, [fetchContacts, fetchCustomer]);

  if (!customer) {
    return null;
  }

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

ProfileProvider.propTypes = {
  children: PropTypes.node.isRequired,
  contacts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  deleteContact: PropTypes.func.isRequired,
  deleteCustomer: PropTypes.func.isRequired,
  fetchContacts: PropTypes.func.isRequired,
  fetchCustomer: PropTypes.func.isRequired,
  merchantCustomerAttributes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  push: PropTypes.func.isRequired,
  showDialog: PropTypes.func.isRequired,
  updateCustomer: PropTypes.func.isRequired,
  customer: PropTypes.shape(),
};

ProfileProvider.defaultProps = {
  customer: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileProvider);
