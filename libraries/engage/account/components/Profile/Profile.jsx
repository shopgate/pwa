import React from 'react';
import Provider from './Profile.provider';
import AddressBook from './ProfileAddressBook';
import Header from './ProfileHeader';
import Form from './ProfileForm';

/** @returns {JSX} */
const Profile = () => (
  <Provider>
    <Header />
    <Form />
    <AddressBook />
  </Provider>
);

export default Profile;
