/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import PlaceholderLabel from 'Components/PlaceholderLabel';
import PriceInfoBase from 'Components/PriceInfo';
import connect from './connector';
import styles from './style';

/**
 * The PriceInfo component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const PriceInfo = ({ price }) => (
  <PlaceholderLabel ready={(price !== null)} className={styles.placeholder}>
    {(price && price.info !== '') && (
      <PriceInfoBase className={styles.priceInfo} text={price.info} />
    )}
  </PlaceholderLabel>
);

PriceInfo.propTypes = {
  price: PropTypes.shape(),
};

PriceInfo.defaultProps = {
  price: '',
};

export default connect(PriceInfo);
