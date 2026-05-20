import React, { useRef } from 'react';
import { SurroundPortals } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import StoreFinderMap from './StoreFinderMap';
import { StoreFinderProvider } from '../../../providers';
import { STORE_DETAILS_LOCATION_MAP } from '../../../constants/Portals';

const useStyles = makeStyles()({
  container: {
    maxHeight: '250px',
    height: '250px',
    width: '100%',
    marginTop: '10px',
    marginBottom: '10px',
  },
});

/**
* Store location map component.
* @returns {JSX.Element}
*/
const StoreLocationMap = () => {
  const { classes } = useStyles();
  const storeListRef = useRef(null);

  return (
    <StoreFinderProvider storeListRef={storeListRef}>
      <SurroundPortals portalName={STORE_DETAILS_LOCATION_MAP}>
        <div className={classes.container}>
          <StoreFinderMap />
        </div>
      </SurroundPortals>
    </StoreFinderProvider>
  );
};

export default StoreLocationMap;
