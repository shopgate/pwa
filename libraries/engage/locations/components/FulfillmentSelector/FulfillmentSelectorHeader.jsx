import React from 'react';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  container: {
    fontWeight: 500,
    marginBottom: variables.gap.xsmall,
  },
});

/**
 * Renders the fulfillment selector title.
 * @returns {JSX.Element}
 */
export const FulfillmentSelectorHeader = () => {
  const { classes } = useStyles();

  return (
    // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
    <div role="heading" className={classes.container}>
      {i18n.text('locations.fulfillment.heading')}
    </div>
  );
};
