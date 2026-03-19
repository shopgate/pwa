import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { i18n, historyPush } from '@shopgate/engage/core';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { RippleButton } from '@shopgate/engage/components';
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

const useStyles = makeStyles()({
  title: {
    color: 'var(--color-text-high-emphasis)',
    lineHeight: 2.5,
    fontSize: 17,
    fontWeight: '600',
  },
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
});

/**
 * @returns {JSX}
 */
const ProfileAddressBook = ({ push }) => {
  const { classes } = useStyles();
  const { contacts, deleteContact, editContact } = useProfileContext();

  return (
    <div>
      <span className={classes.title}>
        {i18n.text('account.profile.address_book.title')}
      </span>
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
          {i18n.text('account.profile.address_book.add')}
        </RippleButton>
      </div>
    </div>
  );
};

ProfileAddressBook.propTypes = {
  push: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(ProfileAddressBook);
