import React from 'react';
import { css } from 'glamor';
import Provider from './Profile.provider';
import AddressBook from './ProfileAddressBook';
import Header from './ProfileHeader';
import Form from './ProfileForm';

const styles = {
  root: css({
    padding: 8,
  }).toString(),
};

/** @returns {JSX} */
const Profile = () => (
  <Provider>
    <div className={styles.root}>
      <Header />
      <Form />
      <AddressBook />
    </div>
  </Provider>
);

export default Profile;
