import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { useWidget } from '@shopgate/engage/page/hooks';

const useStyles = makeStyles()(theme => ({
  root: {
    padding: theme.spacing(2),
    minHeight: 200,

  },
  pre: {
    background: '#26373F',
    color: '#FFF302',
    fontSize: 10,
    overflowY: 'auto',
  },
}));

/**
 * The PlaceholderWidget component is used to display a placeholder for widget types that
 * are not implemented yet.
 * @returns {JSX.Element}
 */
const PlaceholderWidget = () => {
  const { classes } = useStyles();
  const {
    code, config, layout, visibility,
  } = useWidget();

  return (
    <div className={classes.root}>
      <pre className={classes.pre}>
        {JSON.stringify({
          code,
          config,
          layout,
          visibility,
        }, null, 2)}
      </pre>
    </div>
  );
};

export default PlaceholderWidget;
