import React from 'react';
import ProfileProvider from '../../../account/components/Profile/Profile.provider';
import AddressBookProvider from '../../providers/AddressBookProvider';

import AddressList from './AddressList';

/**
 * The AddressBook components
 * @param {Object} props The component props
 * @returns {JSX}
 */
const AddressBook = () => (
  <AddressBookProvider>
    <ProfileProvider>
      <AddressList />
    </ProfileProvider>
  </AddressBookProvider>
);

export default AddressBook;
