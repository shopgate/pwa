import React, { memo } from 'react';
import Grid from '@shopgate/pwa-common/components/Grid';
import showTaxDisclaimer from '@shopgate/pwa-common-commerce/market/helpers/showTaxDisclaimer';
import { useWidgetSettings } from '@shopgate/engage/core/hooks/useWidgetSettings';
import styles from './style';

/**
 * @returns {JSX}
 */
const TaxDisclaimer = () => {
  const {
    show,
  } = useWidgetSettings('@shopgate/engage/components/TaxDisclaimer');
  // use widget setting if set to true/false, otherwise use market logic
  const showDisclaimer = typeof show === 'boolean' ? show : showTaxDisclaimer;

  if (!showDisclaimer) {
    return null;
  }

  return (
    <Grid.Item className={styles} component="div" grow={0} shrink={0} />
  );
};

export default memo(TaxDisclaimer);
