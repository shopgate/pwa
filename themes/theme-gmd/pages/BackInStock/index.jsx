import { View } from '@shopgate/engage/components';
import React from 'react';
import { i18n } from '@shopgate/engage/core';
import { BackBar } from 'Components/AppBar/presets';
import { BackInStockReminders } from '@shopgate/engage/back-in-stock/components';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

/**
 * The BackInStockPage component.
 * @returns {JSX}
 */
const BackInStockPage = () => (
  <View aria-hidden={false} background={colors.background}>
    <BackBar title={i18n.text('titles.back_in_stock')} />
    <BackInStockReminders />
  </View>
);

export default BackInStockPage;
