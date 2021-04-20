import React, { Fragment, useMemo } from 'react';
import { css } from 'glamor';
import { i18n, useRoute } from '@shopgate/engage/core';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { ResponsiveBackButton } from '../ResponsiveBackButton';
import ProfileContact from '../../../account/components/ProfileContact';
import AddressBookProvider from '../../providers/AddressBookProvider';
import { ADDRESS_TYPE_BILLING } from '../../constants';

const styles = {
  headline: css({
    padding: 16,
    fontSize: '2.125rem',
    fontWeight: 'normal',
    margin: 0,
    lineHeight: '2.25rem',
  }).toString(),
};

/**
 * AddressBookContact
 * @param {Object} props The component props
 * @returns {JSX}
 */
const AddressBookContact = () => {
  const { state: { contact }, params: { type = ADDRESS_TYPE_BILLING } } = useRoute();
  const title = useMemo(() => {
    const mode = contact ? 'edit' : 'add';
    return i18n.text(`titles.checkout_addresses_${mode}_${type}`);
  }, [contact, type]);

  return (
    <Fragment>
      <ResponsiveContainer webOnly breakpoint=">xs">
        <ResponsiveBackButton />
        <h1 className={styles.headline}>
          {title}
        </h1>
      </ResponsiveContainer>
      <AddressBookProvider>
        <ProfileContact />
      </AddressBookProvider>
    </Fragment>
  );
};

export default AddressBookContact;
