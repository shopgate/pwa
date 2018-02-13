/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import PlaceholderLabel from 'Components/PlaceholderLabel';
import StrikePrice from 'Components/PriceStriked';
import connect from './connector';
import styles from './style';

/**
 * The PriceStriked component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const PriceStriked = ({ price }) => (
  <PlaceholderLabel
    className={styles.placeholder}
    ready={(price !== null)}
  >
    {(price && price.msrp > 0 && price.unitPrice !== price.msrp) && (
      <Fragment>
        <I18n.Text
          string="price.msrp"
          className={styles.msrp}
        />
        <StrikePrice
          className={styles.msrpStriked}
          value={price.msrp}
          currency={price.currency}
        />
      </Fragment>
    )}
    {(price && !price.msrp && price.unitPriceStriked > 0) && (
      <StrikePrice
        value={price.unitPriceStriked}
        currency={price.currency}
      />
    )}
  </PlaceholderLabel>
);

PriceStriked.propTypes = {
  price: PropTypes.shape(),
};

PriceStriked.defaultProps = {
  price: null,
};

export default connect(PriceStriked);
