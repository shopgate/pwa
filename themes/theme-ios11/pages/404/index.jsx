import React from 'react';
import { i18n } from '@shopgate/engage/core';
import { View } from '@shopgate/engage/components';
import { AppBar } from '@shopgate/pwa-ui-ios';
import { BackBar } from 'Components/AppBar/presets';
import { NotFound } from '@shopgate/engage/page';

/**
 * @returns {JSX}
 */
const PageNotFound = () => (
  <View>
    <BackBar
      right={null}
      center={<AppBar.Title title={i18n.text('titles.page_not_found')} />}
    />
    <NotFound />
  </View>
);

export default PageNotFound;
