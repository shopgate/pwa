import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import I18n from '@shopgate/pwa-common/components/I18n';
import Ripple from '@shopgate/pwa-ui-shared/Ripple';
import FilterIcon from '@shopgate/pwa-ui-ios/icons/FilterIcon';
import connect from './connector';
import styles from './style';

/**
 * The Filter Bar Content Filter Button component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const FilterButton = ({ handleOpenFilters }) => (
  <button className={styles.button} onClick={handleOpenFilters} data-test-id="filterButton">
    <Ripple className={styles.filterButtonRipple} fill>
      <Grid component="div">
        <Grid.Item component="div" className={styles.filterIcon}>
          <FilterIcon />
        </Grid.Item>
        <Grid.Item
          className={styles.filterButton}
          component="div"
        >
          <span className={styles.filterButtonLabel}>
            <I18n.Text string="titles.filter" />
          </span>
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
