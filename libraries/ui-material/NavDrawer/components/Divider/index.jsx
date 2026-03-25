import React from 'react';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    // prevent two consecutive dividers
    '& + hr': {
      display: 'none',
    },
    background: themeColors.darkGray,
    border: 0,
    height: 1,
    margin: '16px 0',
  },
});

/**
 * @returns {JSX}
 */
const NavDrawerDivider = () => {
  const { classes } = useStyles();
  return <hr aria-hidden className={classes.root} />;
};

export default NavDrawerDivider;
