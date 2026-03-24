import React from 'react';
import FavoriteLists from '@shopgate/engage/favorites/components/Lists';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  container: {
    flexGrow: 1,
    paddingTop: variables.gap.xsmall,
    paddingBottom: variables.gap.xxbig,
  },
});

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
