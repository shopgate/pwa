import React from 'react';
import { View } from '@shopgate/engage/components';
import { PAGE_ID_INDEX } from '@shopgate/pwa-common/constants/PageIDs';
import { themeConfig } from '@shopgate/engage';
import PageContent from '../Page/components/Content';

const { colors } = themeConfig;

/**
 * @returns {JSX}
 */
const StartPage = () => (
  <View background={colors.shade8}>
    <PageContent pageId={PAGE_ID_INDEX} />
  </View>
);

export default StartPage;
