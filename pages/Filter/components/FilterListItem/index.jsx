/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import Grid from '@shopgate/pwa-common/components/Grid';
import Label from './components/Label';
import styles from './style';

const FilterListItem = ({ filter, onClear }) => (
  <div className={styles.item} rt-stateless>
    <Link href={filter.url}>
      <Grid>
        <Grid.Item className={styles.gridItem} grow="{1}" shrink="{0}">
          <Label label={filter.label} />
        </Grid.Item>
        <Grid.Item rt-if="props.values" grow="{1}" className={styles.rightContainer}>
          <FilterListItemChips values={filter.active} />
        </Grid.Item>
      </Grid>
    </Link>
    <FilterListItemCrossButton rt-if="props.values" onClear={onClear} />
  </div>
);

FilterListItem.propTypes = {

};

FilterListItem.defaultProps = {

};

export default FilterListItem;
