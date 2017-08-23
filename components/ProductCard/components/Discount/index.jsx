/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import DiscountBadge from 'Components/DiscountBadge';
import styles from '../../style';

/**
 * The Discount component.
 * @return {JSX|null}
 */
const Discount = pure(({ hidePrice, discount }) => {
  if (hidePrice || !discount) {
    return null;
  }

  return (
    <div className={styles.badgeWrapper}>
      <DiscountBadge text={`-${discount}%`} />
    </div>
  );
});

Discount.propTypes = {
  hidePrice: PropTypes.bool.isRequired,
  discount: PropTypes.number,
};

Discount.defaultProps = {
  discount: null,
};

export default Discount;
