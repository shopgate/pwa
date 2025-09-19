import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { usePlaceholderWidget } from './hooks';

const useStyles = makeStyles()(theme => ({
  root: {
    padding: theme.spacing(2),
    minHeight: 200,
  },
  name: {
    fontSize: 14,
  },
  pre: {
    background: '#f7f9fc',
    border: '1px solid #dbdde2',
    borderRadius: 8,
    color: '#000',
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
      <div className={classes.name}>{name}</div>
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
