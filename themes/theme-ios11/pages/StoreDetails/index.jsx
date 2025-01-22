import React from 'react';
import { i18n } from '@shopgate/engage/core/helpers';
import { View } from '@shopgate/engage/components';
import { AppBar } from '@shopgate/pwa-ui-ios';
import { BackBar } from 'Components/AppBar/presets';
import { StoreDetailsContent } from '@shopgate/engage/locations/components';

/**
 * @returns {JSX}
 */
const StoreDetails = () => (
  <View>
    <BackBar
      right={null}
      center={<AppBar.Title title={i18n.text('titles.store_details')} />}
    />
    <div>
      <StoreDetailsContent />
    </div>
  </View>
);

export default StoreDetails;
