import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { i18n, historyPush } from '@shopgate/engage/core';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { RippleButton, Typography } from '@shopgate/engage/components';
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

const useStyles = makeStyles()(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -4,
  },
  button: {
    '&&': {
      marginTop: 8,
      marginRight: 16,
      backgroundColor: theme.palette.primary.main,
      borderRadius: 5,
      textTransform: 'none',
      padding: 0,
      [responsiveMediaQuery('<md', { webOnly: false })]: {
        width: '100%',
        marginRight: 0,
      },
    },
  },
  ripple: {
    padding: '8px 16px',
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
        <RippleButton
          className={classes.button}
          rippleClassName={classes.ripple}
          type="primary"
          onClick={() => push({ pathname: PROFILE_ADDRESS_PATH })}
        >
          <Typography variant="body2" component="span" fontWeight="bold">
            {i18n.text('account.profile.address_book.add')}
          </Typography>
        </RippleButton>
      </div>
    </div>
  );
};

ProfileAddressBook.propTypes = {
  push: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(ProfileAddressBook);
