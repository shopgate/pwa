import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import I18n from '@shopgate/pwa-common/components/I18n';
import Ripple from '@shopgate/pwa-ui-shared/Ripple';
import FilterIcon from '@shopgate/pwa-ui-shared/icons/FilterIcon';
import { RouteContext } from '@shopgate/pwa-common/context';
import connect from './connector';
import styles from './style';

/**
 * The Filter Bar Content Filter Button component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const FilterButton = connect(({ navigate }) => (
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
));

FilterButton.propTypes = {
  navigate: PropTypes.func,
};

FilterButton.defaultProps = {
  navigate() {},
};

export default () => (
  <RouteContext.Consumer>
    {({ query, params }) => (
      <FilterButton categoryId={params.categoryId || null} query={query || {}} />
    )}
  </RouteContext.Consumer>
);
