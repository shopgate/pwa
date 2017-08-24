/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import Grid from '@shopgate/pwa-common/components/Grid';
import Item from '../Item';
import styles from './style';

/**
 * The Product Grid Iterator component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Iterator = pure(props => (
  <Grid.Item
    key={props.id}
    itemProp="itemListElement"
    itemScope
    itemType="http://schema.org/ListItem"
    className={styles.item}
  >
    <Item product={props} display={props.display} />
  </Grid.Item>
));

Iterator.propTypes = {
  display: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default Iterator;
