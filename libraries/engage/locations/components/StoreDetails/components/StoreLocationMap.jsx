import React, { useRef } from 'react';
import { css } from 'glamor';
import { SurroundPortals } from '@shopgate/engage/components';
import StoreFinderMap from './StoreFinderMap';
import { StoreFinderProvider } from '../../../providers';
import { STORE_DETAILS_LOCATION_MAP } from '../../../constants/Portals';

const styles = {
  container: css({
    maxHeight: '250px',
    height: '250px',
    width: '100%',
    marginTop: '10px',
    marginBottom: '10px',
  }).toString(),
};

/**
* Store location map component.
* @returns {JSX.Element}
*/
const StoreLocationMap = () => {
  const storeListRef = useRef(null);

  return (
    <StoreFinderProvider storeListRef={storeListRef}>
      <SurroundPortals portalName={STORE_DETAILS_LOCATION_MAP}>
        <div className={styles.container}>
          <StoreFinderMap />
        </div>
      </SurroundPortals>
    </StoreFinderProvider>
  );
};

export default StoreLocationMap;
