import React from 'react';
import pure from 'recompose/pure';
import Grid from '@shopgate/pwa-common/components/Grid';
import showTaxDisclaimer from '@shopgate/pwa-common-commerce/market/helpers/showTaxDisclaimer';
import styles from './style';

/**
 * @returns {JSX}
 */
const TaxDisclaimer = () => {
  if (!showTaxDisclaimer) {
    return null;
  }

  return (
    <Grid.Item className={styles} component="div" grow={0} shrink={0} />
  );
};

export default pure(TaxDisclaimer);
