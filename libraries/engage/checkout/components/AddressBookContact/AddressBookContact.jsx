import React, { useMemo } from 'react';
import { i18n, useRoute } from '@shopgate/engage/core';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { ResponsiveBackButton } from '../ResponsiveBackButton';
import ProfileContact from '../../../account/components/ProfileContact';
import AddressBookProvider from '../../providers/AddressBookProvider';
import { ADDRESS_TYPE_BILLING } from '../../constants';

const useStyles = makeStyles()({
  headline: {
    padding: 16,
    fontSize: '2.125rem',
    fontWeight: 'normal',
    margin: 0,
    lineHeight: '2.25rem',
  },
});

/**
 * AddressBookContact
 * @returns {JSX}
 */
const AddressBookContact = () => {
  const { classes } = useStyles();
  const { state: { contact }, params: { type = ADDRESS_TYPE_BILLING } } = useRoute();
  const title = useMemo(() => {
    const mode = contact ? 'edit' : 'add';
    return i18n.text(`titles.checkout_addresses_${mode}_${type}`);
  }, [contact, type]);

  return (
    <>
      <ResponsiveContainer webOnly breakpoint=">xs">
        <ResponsiveBackButton />
        <h1 className={classes.headline}>
          {title}
        </h1>
      </ResponsiveContainer>
      <AddressBookProvider>
        <ProfileContact />
      </AddressBookProvider>
    </>
  );
};

export default AddressBookContact;
