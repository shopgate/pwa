import React from 'react';
import { View } from '@shopgate/engage/components';
import { BackBar } from 'Components/AppBar/presets';
import { i18n } from '@shopgate/engage/core/helpers';
import { Checkout } from '@shopgate/engage/checkout/components';

/**
 * The Cart component.
 * @returns {JSX}
 */
const CheckoutPage = () => (
  <View aria-hidden={false}>
    <BackBar
      right={null}
      title={i18n.text('titles.checkout')}
    />
    <Checkout />
  </View>
);

export default CheckoutPage;
