import React from 'react';
import { i18n } from '@shopgate/engage/core';
import { View } from '@shopgate/engage/components';
import { AppBar } from '@shopgate/pwa-ui-ios';
import { StoreFinder as Content } from '@shopgate/engage/locations';
import { BackBar } from 'Components/AppBar/presets';

/**
 * @returns {JSX}
 */
const StoreFinder = () => (
  <View aria-hidden={false}>
    <BackBar
      right={null}
      center={<AppBar.Title title={i18n.text('titles.store_finder')} />}
    />
    <Content />
  </View>
);

export default StoreFinder;
