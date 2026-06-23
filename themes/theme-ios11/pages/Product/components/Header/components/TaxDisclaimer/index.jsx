import React, { memo, useMemo } from 'react';
import Grid from '@shopgate/pwa-common/components/Grid';
import showTaxDisclaimer from '@shopgate/pwa-common-commerce/market/helpers/showTaxDisclaimer';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    width: 10,
  },
});

/**
 * @returns {JSX}
 */
const TaxDisclaimer = () => {
  const { classes } = useStyles();
  // Added with PWA 6 - CCP-2372
  const {
    show,
  } = useWidgetSettings('@shopgate/engage/components/TaxDisclaimer');

  // use widget setting if set to true/false, otherwise use market logic
  const showDisclaimer = useMemo(
    () => (typeof show === 'boolean' ? show : showTaxDisclaimer),
    [show]
  );

  if (!showDisclaimer) {
    return null;
  }

  return (
    <Grid.Item className={classes.root} component="div" grow={0} shrink={0} />
  );
};

export default memo(TaxDisclaimer);
