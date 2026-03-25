import React from 'react';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  header: {
    fontSize: '2.125rem',
    lineHeight: '2.25rem',
    padding: variables.gap.xbig,
  },
});

/**
 * @return {JSX}
 */
const CartHeaderWide = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.header}>
      { i18n.text('navigation.cart') }
    </div>
  );
};

export default CartHeaderWide;
