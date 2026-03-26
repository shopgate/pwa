import React from 'react';
import FavoriteLists from '@shopgate/engage/favorites/components/Lists';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  container: {
    flexGrow: 1,
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(8),
  },
}));

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const FavoritesList = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <FavoriteLists />
    </div>
  );
};

export default FavoritesList;
