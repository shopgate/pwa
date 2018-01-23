/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import I18n from '@shopgate/pwa-common/components/I18n';
import Ripple from 'Components/Ripple';
import FilterIcon from 'Components/icons/FilterIcon';
import connect from './connector';
import styles from './style';

/**
 * The Filter Bar Content Filter Button component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const FilterButton = ({ handleOpenFilters }) => (
  <button className={styles.button} onClick={handleOpenFilters}>
    <Ripple className={styles.filterButtonRipple} fill>
      <Grid component="div">
        <Grid.Item className={styles.filterButton} component="div">
          <span className={styles.filterButtonLabel}>
            <I18n.Text string="titles.filter" />
          </span>
        </Grid.Item>
        <Grid.Item component="div">
          <FilterIcon />
        </Grid.Item>
      </Grid>
    </Ripple>
  </button>
);

FilterButton.propTypes = {
  handleOpenFilters: PropTypes.func,
};

FilterButton.defaultProps = {
  handleOpenFilters: () => {},
};

export default connect(FilterButton);
