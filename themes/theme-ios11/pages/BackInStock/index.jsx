import { View } from '@shopgate/engage/components';
import React from 'react';
import { i18n } from '@shopgate/engage/core';
import { BackBar } from 'Components/AppBar/presets';
import { BackInStockReminders } from '@shopgate/engage/back-in-stock';

/**
 * The BackInStockPage component.
 * @returns {JSX}
 */
const BackInStockPage = () => (
  <View aria-hidden={false}>
    <BackBar title={i18n.text('titles.back_in_stock')} />
    <BackInStockReminders />
  </View>
);

export default BackInStockPage;
