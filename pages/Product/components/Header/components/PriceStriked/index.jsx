/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import PlaceholderLabel from 'Components/PlaceholderLabel';
import { PriceStriked as StrikePrice } from 'Components/PriceStriked';
import connect from './connector';
import styles from './style';

/**
 * The PriceStriked component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const PriceStriked = ({ price }) => (
  <PlaceholderLabel className={styles.placeholder} ready={(price !== null)}>
    <div>
      {price.msrp && (
        <span className={styles.msrp}>MSRP</span>
      )}
      {price.msrp && (
        <StrikePrice
          className={styles.msrpStriked}
          value={price.msrp}
          currency={price.currency}
        />
      )}
      {(!price.msrp && price.unitPriceStriked) && (
        <StrikePrice
          className={styles.msrpStriked}
          value={price.unitPriceStriked}
          currency={price.currency}
        />
      )}
    </div>
  </PlaceholderLabel>
);

PriceStriked.propTypes = {
  price: PropTypes.shape(),
};

PriceStriked.defaultProps = {
  price: null,
};

export default connect(PriceStriked);
