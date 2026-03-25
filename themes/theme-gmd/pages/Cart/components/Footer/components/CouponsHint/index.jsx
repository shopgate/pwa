import React from 'react';
import { I18n } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const useStyles = makeStyles()({
  root: {
    '& + span': {
      paddingTop: 0,
    },
    background: colors.background,
    display: 'block',
    fontSize: 12,
    padding: `20px ${variables.gap.big}px`,
    textAlign: 'left',
  },
});

/**
 * The CouponsHint components
 * @returns {JSX}
 */
const CouponsHint = () => {
  const { classes } = useStyles();

  return <I18n.Text className={classes.root} string="cart.coupons_not_supported" />;
};

export default CouponsHint;
