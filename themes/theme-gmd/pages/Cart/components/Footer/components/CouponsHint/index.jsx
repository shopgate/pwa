import React from 'react';
import { I18n } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  root: {
    '& + span': {
      paddingTop: 0,
    },
    background: theme.palette.background.default,
    display: 'block',
    fontSize: 12,
    padding: theme.spacing(2.5, 2),
    textAlign: 'left',
  },
}));

/**
 * The CouponsHint components
 * @returns {JSX}
 */
const CouponsHint = () => {
  const { classes } = useStyles();

  return <I18n.Text className={classes.root} string="cart.coupons_not_supported" />;
};

export default CouponsHint;
