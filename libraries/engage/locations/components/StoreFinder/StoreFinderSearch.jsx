import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { themeVariables } from '@shopgate/pwa-common/helpers/config';
import StoreListSearch from '../StoreList/StoreListSearch';

const useStyles = makeStyles()({
  container: {
    paddingBottom: themeVariables.gap.small,
  },
});

/**
 * @returns {JSX}
 */
const StoreFinderSearch = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <StoreListSearch isStoreFinder />
    </div>
  );
};

export default StoreFinderSearch;
