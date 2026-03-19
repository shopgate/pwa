import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import {
  Grid, I18n, Ripple, FilterIcon,
} from '@shopgate/engage/components';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  button: {
    color: 'inherit',
    fontSize: '1.5rem',
    lineHeight: 1,
    outline: 0,
    padding: 0,
    minWidth: variables.navigator.height,
    height: variables.filterbar.height,
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
  },
  filterButton: {
    display: 'flex',
  },
  filterButtonLabel: {
    alignSelf: 'center',
    fontSize: '0.875rem',
    fontWeight: '500',
    lineHeight: 1,
    paddingRight: variables.gap.small,
  },
  filterButtonRipple: {
    display: 'flex',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    padding: '6px 10px',
  },
});

/**
 * The Filter Bar Content Filter Button component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
function FilterButton({ openFilters }) {
  const { classes } = useStyles();
  return (
    <button className={`${classes.button} theme__filter-bar__filter-button`} onClick={openFilters} data-test-id="filterButton" type="button">
      <Ripple className={classes.filterButtonRipple} fill>
        <Grid component="div">
          <Grid.Item className={classes.filterButton} component="div">
            <span className={classes.filterButtonLabel}>
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
  openFilters: PropTypes.func.isRequired,
};

export default FilterButton;
