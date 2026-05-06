import React, { useRef } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { StoreFinderProvider } from '../../providers';
import StoreFinderSearch from './StoreFinderSearch';
import StoreFinderLocations from './StoreFinderLocations';

const useStyles = makeStyles()(theme => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'auto 1fr',
    gridTemplateAreas: '"search" "store-list"',
    height: 'inherit',
  },
  storeSearch: {
    gridArea: 'search',
    padding: theme.spacing(2, 0.5, 0, 0.5),
    ' select': {
      color: 'var(--color-text-medium-emphasis)',
    },
  },
  storeList: {
    gridArea: 'store-list',
    width: '100%',
    overflow: 'hidden',
    padding: '0 12px 8px 12px',
  },
}));

/**
 * @returns {JSX.Element}
 */
const StoreFinder = () => {
  const { classes } = useStyles();
  const storeListRef = useRef(null);

  return (
    <StoreFinderProvider storeListRef={storeListRef}>
      <div className={classes.container}>
        <div className={classes.storeSearch}>
          <StoreFinderSearch />
        </div>
        <div className={classes.storeList}>
          <StoreFinderLocations ref={storeListRef} />
        </div>
      </div>
    </StoreFinderProvider>
  );
};

export default StoreFinder;
