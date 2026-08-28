import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { i18n } from '@shopgate/engage/core/helpers';
import {
  Badge, I18n, FilterIcon, Typography,
} from '@shopgate/engage/components';

const useStyles = makeStyles()(theme => ({
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    color: 'inherit',
    outline: 0,
    flexShrink: 0,
    margin: theme.spacing(0, 1.5),
    padding: theme.spacing(0.25, 1),
    border: `1px solid ${theme.components.border.medium}`,
    borderRadius: theme.shape.borderRadius,
  },
  buttonActive: {
    borderColor: theme.components.badge.background,
  },
  icon: {
    fontSize: theme.components.icon.medium,
    display: 'flex',
  },
}));

/**
 * The Filter Bar Content Filter Button component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
function FilterButton({ openFilters, filterCount }) {
  const { classes, cx } = useStyles();

  return (
    <button
      className={cx(classes.button, {
        [classes.buttonActive]: filterCount > 0,
      }, 'theme__filter-bar__filter-button')}
      onClick={openFilters}
      data-test-id="filterButton"
      aria-label={i18n.text('titles.filter')}
      type="button"
    >
      <span className={classes.icon}>
        <FilterIcon />
      </span>
      <Typography variant="subtitle2" component="span">
        <I18n.Text string="titles.filter" />
      </Typography>
      <Badge count={filterCount} max={9} aria-hidden />
    </button>
  );
}

FilterButton.propTypes = {
  openFilters: PropTypes.func.isRequired,
  filterCount: PropTypes.number,
};

FilterButton.defaultProps = {
  filterCount: 0,
};

export default FilterButton;
