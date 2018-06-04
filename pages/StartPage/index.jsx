import React from 'react';
import View from 'Components/View';
import { PAGE_ID_INDEX } from '@shopgate/pwa-common/constants/PageIDs';
import PageContent from '../Page/components/Content';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const StartPage = () => (
  <View>
    <PageContent pageId={PAGE_ID_INDEX} />
  </View>
);

export default StartPage;
