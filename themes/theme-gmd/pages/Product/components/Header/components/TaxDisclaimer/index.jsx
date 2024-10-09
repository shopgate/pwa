import React, { memo, useMemo } from 'react';
import Grid from '@shopgate/pwa-common/components/Grid';
import showTaxDisclaimer from '@shopgate/pwa-common-commerce/market/helpers/showTaxDisclaimer';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import styles from './style';

/**
 * @returns {JSX}
 */
const TaxDisclaimer = () => {
  // Added with PWA 6 - CCP-2372
  const {
    show,
  } = useWidgetSettings('@shopgate/engage/components/TaxDisclaimer');

  const showDisclaimer = useMemo(() =>
    // use widget setting if set to true/false, otherwise use market logic
    (typeof show === 'boolean' ? show : showTaxDisclaimer),
  [show]);

  if (!showDisclaimer) {
    return null;
  }

  return (
    <Grid.Item className={styles} component="div" grow={0} shrink={0} />
  );
};

export default memo(TaxDisclaimer);
