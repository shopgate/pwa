import React from 'react';
import { themeConfig } from '@shopgate/engage';
import { makeStyles } from '@shopgate/engage/styles';
import StoreDetails from './components/StoreDetails';
import StoreLocationMap from './components/StoreLocationMap';
import StoresNearby from './components/StoresNearby';
import FindMoreStores from './components/FindMoreStores';
import { StoreDetailsProvider } from '../../providers';

const useStyles = makeStyles()({
  page: {
    padding: `${themeConfig.variables.gap.small}px ${themeConfig.variables.gap.big}px`,
  },
});

/**
 * The StoreDetailsContent component.
 * @returns {JSX}
 */
const StoreDetailsContent = () => {
  const { classes } = useStyles();

  return (
    <StoreDetailsProvider>
      <div className={classes.page}>
        <StoreDetails />
        <StoreLocationMap />
        <StoresNearby />
        <FindMoreStores />
      </div>
    </StoreDetailsProvider>
  );
};

export default StoreDetailsContent;
