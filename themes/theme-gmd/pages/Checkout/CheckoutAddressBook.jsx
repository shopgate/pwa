import React from 'react';
import { View } from '@shopgate/engage/components';
import { AppBar } from '@shopgate/pwa-ui-material';
import { BackBar } from 'Components/AppBar/presets';
import { i18n, useRoute } from '@shopgate/engage/core';
import { ADDRESS_TYPE_BILLING } from '@shopgate/engage/checkout/constants';
import { AddressBook as Content } from '@shopgate/engage/checkout/components';

/**
 * @returns {JSX}
 */
const CheckoutAddressBook = () => {
  const { params: { type = ADDRESS_TYPE_BILLING } } = useRoute();

  return (
    <View aria-hidden={false}>
      <BackBar
        right={null}
        center={
          <AppBar.Title title={i18n.text(`titles.checkout_addresses_${type}`)} />
        }
      />
      <Content />
    </View>
  );
};

export default CheckoutAddressBook;
