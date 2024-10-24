import React from 'react';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import {
  PRODUCT_TAX_DISCLAIMER,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import I18n from '@shopgate/pwa-common/components/I18n';
import showTaxDisclaimer from '@shopgate/pwa-common-commerce/market/helpers/showTaxDisclaimer';
import { useWidgetSettings } from '@shopgate/engage/core/hooks/useWidgetSettings';
import styles from './style';

/**
 * TaxDisclaimer component.
 * @returns {Function}
 */
const TaxDisclaimer = () => {
  // Added with PWA 6 - CCP-2372
  const {
    show,
    text,
  } = useWidgetSettings('@shopgate/engage/components/TaxDisclaimer');

  // use widget setting if set to true/false, otherwise use market logic
  const showDisclaimer = typeof show === 'boolean' ? show : showTaxDisclaimer;

  return (
    <SurroundPortals
      portalName={PRODUCT_TAX_DISCLAIMER}
      portalProps={{ showTaxDisclaimer: showDisclaimer }}
    >
      {showDisclaimer && (
      <div data-test-id="taxDisclaimer" aria-hidden className="ui-shared__tax-disclaimer">
        <I18n.Text className={styles} string={text || 'product.tax_disclaimer'} />
      </div>
      )}
    </SurroundPortals>
  );
};

export default TaxDisclaimer;
