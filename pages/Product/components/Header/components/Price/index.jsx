/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import PlaceholderLabel from 'Components/PlaceholderLabel';
import PriceBase from 'Components/Price';
import connect from './connector';
import styles from './style';

/**
 * The Price component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Price = ({ price }) => (
  <PlaceholderLabel ready={(price !== null)} className={styles.placeholder}>
    {(price && price.unitPrice) && (
      <PriceBase
        className={styles.price}
        unitPrice={price.totalPrice}
        unitPriceMin={price.unitPriceMin}
        discounted={!!price.discount}
        currency={price.currency}
      />
    )}
  </PlaceholderLabel>
);

Price.propTypes = {
  price: PropTypes.shape(),
};

Price.defaultProps = {
  price: null,
};

export default connect(Price);
