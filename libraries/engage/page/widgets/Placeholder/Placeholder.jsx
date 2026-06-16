import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { Typography } from '@shopgate/engage/components';
import { usePlaceholderWidget } from './hooks';

const useStyles = makeStyles()(theme => ({
  root: {
    padding: theme.spacing(2),
    minHeight: 200,
  },
  pre: {
    background: theme.palette.background.emphasized,
    border: `1px solid ${theme.components.border.light}`,
    borderRadius: 8,
    color: theme.contrastColor(theme.palette.background.emphasized),
    fontSize: 10,
    overflowY: 'auto',
    padding: theme.spacing(1),
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
    code, name, config, layout, visibility,
  } = usePlaceholderWidget();

  return (
    <div className={classes.root}>
      <Typography variant="body2" component="div">{name}</Typography>
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
