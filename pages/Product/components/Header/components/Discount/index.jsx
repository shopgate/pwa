/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import PlaceholderLabel from 'Components/PlaceholderLabel';
import DiscountBadge from 'Components/DiscountBadge';
import connect from './connector';
import styles from './style';

/**
 * The Discount component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Discount = ({ price }) => {
  if (price && typeof price.discount === 'undefined') {
    return null;
  }

  return (
    <PlaceholderLabel ready={(price !== null)} className={styles.placeholder}>
      {!!(price && price.discount) && (
        <div className={styles.discount}>
          <DiscountBadge text={`-${price.discount}%`} />
        </div>
      )}
    </PlaceholderLabel>
  );
};

Discount.propTypes = {
  price: PropTypes.shape(),
};

Discount.defaultProps = {
  price: null,
};

export default connect(Discount);
