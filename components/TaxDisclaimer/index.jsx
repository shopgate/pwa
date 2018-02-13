/**
 *  Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */

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
    <I18n.Text
      className={styles}
      string="product.tax_disclaimer"
    />
  ) : null
);

export default TaxDisclaimer;
