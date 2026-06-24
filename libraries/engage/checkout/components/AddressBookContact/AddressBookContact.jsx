import React, { useMemo } from 'react';
import { i18n, useRoute } from '@shopgate/engage/core';
import { ResponsiveContainer, Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { ResponsiveBackButton } from '../ResponsiveBackButton';
import ProfileContact from '../../../account/components/ProfileContact';
import AddressBookProvider from '../../providers/AddressBookProvider';
import { ADDRESS_TYPE_BILLING } from '../../constants';

const useStyles = makeStyles()(theme => ({
  headline: {
    padding: 16,
    fontWeight: theme.typography.fontWeightRegular,
    margin: 0,
  },
}));

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
        <Typography variant="h1" component="h1" className={classes.headline}>
          {title}
        </Typography>
      </ResponsiveContainer>
      <AddressBookProvider>
        <ProfileContact />
      </AddressBookProvider>
    </>
  );
};

export default AddressBookContact;
