import React from 'react';
import { i18n } from '@shopgate/engage/core';
import { View } from '@shopgate/engage/components';
import { AppBar } from '@shopgate/pwa-ui-ios';
// import { StoreFinder as Content } from '@shopgate/engage/locations';
import { BackBar } from 'Components/AppBar/presets';
import { StoreDetailsContent } from '@shopgate/engage/locations/components';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/engage';

const styles = {
  page: css({
    padding: `${themeConfig.variables.gap.small}px ${themeConfig.variables.gap.big}px`,
  }).toString(),
};

/**
 * @returns {JSX}
 */
const StoreDetails = () => (
  <View aria-hidden={false}>
    <BackBar
      right={null}
      center={<AppBar.Title title={i18n.text('titles.STOREDETAILS')} />}
    />
    <div className={styles.page}>
      <StoreDetailsContent />
    </div>
  </View>
);

export default StoreDetails;
