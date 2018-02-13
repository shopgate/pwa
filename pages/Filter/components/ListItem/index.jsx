/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import Grid from '@shopgate/pwa-common/components/Grid';
import Label from './components/Label';
import Chips from './components/Chips';
import CrossButton from './components/CrossButton';
import styles from './style';

/**
 * The Filter List Item component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const ListItem = ({ filter }) => {
  const isActive = (filter.active && filter.active.length > 0);

  return (
    <div className={styles.item}>
      <Link href={filter.url}>
        <Grid>
          <Grid.Item
            className={styles.gridItem}
            grow={1}
            shrink={0}
          >
            <Label label={filter.label} />
          </Grid.Item>
          {isActive && (
            <Grid.Item grow={1} className={styles.rightContainer}>
              <Chips values={filter.active} />
            </Grid.Item>
          )}
        </Grid>
      </Link>
      {filter.active && <CrossButton filterId={filter.id} />}
    </div>
  );
};

ListItem.propTypes = {
  filter: PropTypes.shape().isRequired,
};

ListItem.defaultProps = {
  onClear: () => {},
};

export default ListItem;
