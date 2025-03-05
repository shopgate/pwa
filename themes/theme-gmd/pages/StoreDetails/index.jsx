import React from 'react';
import { i18n } from '@shopgate/engage/core/helpers';
import { View, AppBarAndroid } from '@shopgate/engage/components';
import { BackBar } from 'Components/AppBar/presets';
import { StoreDetails as StoreDetailsCmp } from '@shopgate/engage/locations/components';

/**
 * @returns {JSX}
 */
const StoreDetails = () => (
  <View>
    <BackBar
      right={null}
      center={<AppBarAndroid.Title title={i18n.text('titles.store_details')} />}
    />
    <StoreDetailsCmp />
  </View>
);

export default StoreDetails;
