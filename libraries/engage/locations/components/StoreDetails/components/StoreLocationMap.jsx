import React, { useRef } from 'react';
import { css } from 'glamor';
import StoreFinderMap from './StoreFinderMap';
import { StoreFinderProvider } from '../../../providers';

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
      <div className={styles.container}>
        <StoreFinderMap />
      </div>
    </StoreFinderProvider>
  );
};

export default StoreLocationMap;
