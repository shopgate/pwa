import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { i18n, historyPush } from '@shopgate/engage/core';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { Typography } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import AddressCard from './ProfileAddressCard';
import { useProfileContext } from './Profile.provider';
import { PROFILE_ADDRESS_PATH } from '../../constants/routes';

/**
 * @param {Object} dispatch Dispatch
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  push: props => dispatch(historyPush(props)),
});

const useStyles = makeStyles()(() => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -4,
  },
  button: {
    marginTop: 8,
    marginRight: 16,
    [responsiveMediaQuery('<md', { webOnly: false })]: {
      width: '100%',
      marginRight: 0,
    },
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    [responsiveMediaQuery('<md', { webOnly: false })]: {
      flex: 1,
    },
  },
}));

/**
 * @returns {JSX}
 */
const ProfileAddressBook = ({ push }) => {
  const { classes } = useStyles();
  const { contacts, deleteContact, editContact } = useProfileContext();

  return (
    <div>
      <Typography variant="h4" component="div" color="textPrimary" gutterBottom fontWeight="medium">
        {i18n.text('account.profile.address_book.title')}
      </Typography>
      <div className={classes.container}>
        {contacts && contacts.map(contact => (
          <AddressCard
            key={contact.id}
            contact={contact}
            deleteContact={() => deleteContact(contact.id)}
            editContact={() => editContact(contact)}
          />
        ))}
      </div>
      <div className={classes.actions}>
        <Button
          color="primary"
          className={classes.button}
          onClick={() => push({ pathname: PROFILE_ADDRESS_PATH })}
        >
          {i18n.text('account.profile.address_book.add')}
        </Button>
      </div>
    </div>
  );
};

ProfileAddressBook.propTypes = {
  push: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(ProfileAddressBook);
