import React, { useContext } from 'react';
import { RouteContext } from '@shopgate/pwa-common/context';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import { ProgressBar } from '@shopgate/pwa-ui-shared';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    position: 'relative',
    zIndex: 15,
  },
});

/**
 * @returns {JSX}
 */
function Progress() {
  const { classes } = useStyles();
  const { visible, pathname } = useContext(RouteContext);
  const { isLoading } = useContext(LoadingContext);

  return (
    <div className={classes.root}>
      <ProgressBar isVisible={visible && isLoading(pathname)} />
    </div>
  );
}

export default Progress;
