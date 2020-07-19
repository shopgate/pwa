import React from 'react';
import { View } from '@shopgate/engage/components';
import { AppBar } from '@shopgate/pwa-ui-ios';
import { StoreLocationFinder as Content } from '@shopgate/engage/locations';
import { BackBar } from 'Components/AppBar/presets';

/**
 * @returns {JSX}
 */
const StoreFinder = () => (
  <View aria-hidden={false}>
    <BackBar
      right={null}
      center={<AppBar.Title title="titles.store_finder" />}
    />
    <Content />
  </View>
);

export default StoreFinder;
