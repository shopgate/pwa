import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import StoreListSearch from '../StoreList/StoreListSearch';

const useStyles = makeStyles()(theme => ({
  container: {
    paddingBottom: theme.spacing(1),
  },
}));

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
