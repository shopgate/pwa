import React from 'react';
import I18n from '@shopgate/pwa-common/components/I18n';
import showTaxDisclaimer from '@shopgate/pwa-common-commerce/market/helpers/showTaxDisclaimer';
import styles from './style';

/**
 * TaxDisclaimer component.
 * @returns {Function}
 */
const TaxDisclaimer = () => (
  showTaxDisclaimer ? (
    <div data-test-id="taxDisclaimer">
      <I18n.Text
        className={styles}
        string="product.tax_disclaimer"
      />
    </div>
  ) : null
);

export default TaxDisclaimer;
