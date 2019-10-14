import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, I18n, Ripple, FilterIcon,
} from '@shopgate/engage/components';
import { withRoute } from '@shopgate/engage/core';
import connect from './connector';
import styles from './style';

/**
 * The Filter Bar Content Filter Button component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
function FilterButton({ navigate }) {
  return (
    <button className={styles.button} onClick={navigate} data-test-id="filterButton" type="button">
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
}

FilterButton.propTypes = {
  navigate: PropTypes.func,
};

FilterButton.defaultProps = {
  navigate() { },
};

export default withRoute(connect(FilterButton));
