import React, { Fragment } from 'react';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_TAX_DISCLAIMER,
  PRODUCT_TAX_DISCLAIMER_AFTER,
  PRODUCT_TAX_DISCLAIMER_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import I18n from '@shopgate/pwa-common/components/I18n';
import showTaxDisclaimer from '@shopgate/pwa-common-commerce/market/helpers/showTaxDisclaimer';
import styles from './style';

/**
 * TaxDisclaimer component.
 * @returns {Function}
 */
const TaxDisclaimer = () => (
  <Fragment>
    <Portal name={PRODUCT_TAX_DISCLAIMER_BEFORE} />
    <Portal name={PRODUCT_TAX_DISCLAIMER}>
      {showTaxDisclaimer && (
        <div data-test-id="taxDisclaimer" aria-hidden>
          <I18n.Text className={styles} string="product.tax_disclaimer" />
        </div>
      )}
    </Portal>
    <Portal name={PRODUCT_TAX_DISCLAIMER_AFTER} />
  </Fragment>
);

export default TaxDisclaimer;
