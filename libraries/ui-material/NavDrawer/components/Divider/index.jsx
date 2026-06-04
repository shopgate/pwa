import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  root: {
    // prevent two consecutive dividers
    '& + hr': {
      display: 'none',
    },
    background: theme.components.seperatorLine,
    border: 0,
    height: 1,
    margin: '16px 0',
  },
}));

/**
 * @returns {JSX}
 */
const NavDrawerDivider = () => {
  const { classes } = useStyles();
  return <hr aria-hidden className={classes.root} />;
};

export default NavDrawerDivider;
