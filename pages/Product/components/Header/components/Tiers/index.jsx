/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import connect from './connector';
import styles from './style';

/**
 * The Tiers component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Tiers = ({ price }) => {
  if (!(price && price.tiers && price.tiers.length)) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      {price.tiers.map((tier) => {
        // Skip tier if tier price is equal the product price
        if (tier.unitPrice === price.totalPrice) {
          return null;
        }

        const i18nKey = tier.from === tier.to ? 'price.tier.set' : 'price.tier.range';

        return (
          <I18n.Text
            string={i18nKey}
            params={{ from: tier.from }}
            key={tier.from}
            className={styles.tier}
          >
            <I18n.Price forKey="price" price={tier.unitPrice} currency={price.currency} className={styles.price} />
          </I18n.Text>
        );
      })}
    </div>
  );
};

Tiers.propTypes = {
  price: PropTypes.shape(),
};

Tiers.defaultProps = {
  price: null,
};

export { Tiers as TiersUnconnected };
export default connect(Tiers);
