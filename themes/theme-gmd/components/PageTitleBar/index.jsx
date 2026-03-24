import React from 'react';
import { useRoute } from '@shopgate/engage/core';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  container: {
    fontSize: '1.5rem',
    padding: variables.gap.big,
  },
});

/**
 * @returns {JSX}
 */
const PageTitleBar = () => {
  const { classes } = useStyles();
  const { state, query } = useRoute();
  const { title = '' } = state;
  const { s: search } = query;

  if (!title) {
    return null;
  }

  return (
    <ResponsiveContainer breakpoint=">xs" webOnly>
      <div className={classes.container}>
        { search || title }
      </div>
    </ResponsiveContainer>
  );
};

export default PageTitleBar;
