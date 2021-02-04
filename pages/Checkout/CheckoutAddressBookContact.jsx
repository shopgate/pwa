import React, { useMemo } from 'react';
import { View } from '@shopgate/engage/components';
import { AppBar } from '@shopgate/pwa-ui-ios';
import { BackBar } from 'Components/AppBar/presets';
import { i18n, useRoute } from '@shopgate/engage/core';
import { AddressBookContact as Content, ADDRESS_TYPE_BILLING } from '@shopgate/engage/checkout';

/**
 * @returns {JSX}
 */
const CheckoutAddressBookContact = () => {
  const { state: { contact }, params: { type = ADDRESS_TYPE_BILLING } } = useRoute();

  const title = useMemo(() => {
    const mode = contact ? 'edit' : 'add';
    return i18n.text(`titles.checkout_addresses_${mode}_${type}`);
  }, [contact, type]);

  return (
    <View aria-hidden={false}>
      <BackBar
        right={null}
        center={
          <AppBar.Title title={title} />
        }
      />
      <Content />
    </View>
  );
};

export default CheckoutAddressBookContact;
