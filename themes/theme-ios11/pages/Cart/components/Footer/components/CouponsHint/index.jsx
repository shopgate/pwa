import React from 'react';
import { I18n, Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  root: {
    '& + span': {
      paddingTop: 0,
    },
    background: theme.palette.background.surface,
    padding: theme.spacing(2.5, 2),
  },
}));

/**
 * The CouponsHint components
 * @returns {JSX}
 */
const CouponsHint = () => {
  const { classes } = useStyles();

  return (
    <Typography variant="caption" display="block" align="left" className={classes.root}>
      <I18n.Text string="cart.coupons_not_supported" />
    </Typography>
  );
};

export default CouponsHint;
