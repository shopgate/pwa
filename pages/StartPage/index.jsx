import React from 'react';
import { RouteContext } from '@virtuous/react-conductor/Router';
import View from 'Components/View';
import Consume from '@shopgate/pwa-common/components/Consume';
import { PAGE_ID_INDEX } from '@shopgate/pwa-common/constants/PageIDs';
import PageContent from '../Page/components/Content';

/**
 * @returns {JSX}
 */
const StartPage = () => (
  <View>
    <Consume context={RouteContext} props={{ open: 'open' }}>
      {({ open }) => (
        open && <PageContent pageId={PAGE_ID_INDEX} />
      )}
    </Consume>
  </View>
);

export default StartPage;
