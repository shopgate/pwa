import React, { useRef } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import Provider from './Profile.provider';
import AddressBook from './ProfileAddressBook';
import Header from './ProfileHeader';
import Form from './ProfileForm';

const useStyles = makeStyles()({
  root: {
    padding: 8,
  },
});

/** @returns {JSX} */
const Profile = () => {
  const { classes } = useStyles();
  const formContainerRef = useRef(null);

  return (
    <Provider formContainerRef={formContainerRef}>
      <div className={classes.root}>
        <Header />
        <Form ref={formContainerRef} />
        <AddressBook />
      </div>
    </Provider>
  );
};
export default Profile;
