import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import CategoryGrid from 'Components/CategoryGrid';
import Headline from 'Components/Headline';
import connect from './connector';
import CategoryListDefault from './CategoryListDefault';

const { colors } = themeConfig;

const useStyles = makeStyles()(theme => ({
  container: {
    background: colors.light,
  },
  grid: {
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      marginTop: theme.spacing(2),
      paddingBottom: 0,
    },
  },
}));

/**
 * Mirrors legacy `shouldComponentUpdate` for `memo` (return `true` when props are equal).
 * @param {Object} prev Previous props.
 * @param {Object} next Next props.
 * @returns {boolean}
 */
const categoryListPropsAreEqual = (prev, next) => {
  if (!next.items) {
    return true;
  }
  return isEqual(prev.items, next.items) && isEqual(prev.settings, next.settings);
};

/**
 * Core category list widget.
 * @param {Object} props The widget properties
 * @returns {JSX}
 */
const CategoryListWidget = memo(({
  settings,
  fetchCategory,
  items,
}) => {
  const { classes } = useStyles();
  const { categoryNumber } = settings;

  /**
   * Load categories when Redux has not provided `items` yet (`null` / `undefined`).
   * Empty array `[]` is treated as loaded (no refetch) — same as `if (!items)` in the former
   * `componentDidMount`.
   * Dependencies keep the effect aligned with `categoryNumber` and `fetchCategory` without
   * stale closures; when `items` arrives, the effect runs again and exits early.
   */
  useEffect(() => {
    if (items) {
      return;
    }
    fetchCategory(categoryNumber);
  }, [items, fetchCategory, categoryNumber]);

  if (!items) {
    return null;
  }

  return (
    <div className={classes.container} data-test-id="categoryList">
      {(settings.headline) ? <Headline text={settings.headline} /> : null}
      <ResponsiveContainer appAlways breakpoint="<=xs">
        <CategoryListDefault categories={items} settings={settings} />
      </ResponsiveContainer>
      <ResponsiveContainer webOnly breakpoint=">xs">
        <CategoryGrid
          categories={items}
          showImages={settings.showImages}
          className={classes.grid}
        />
      </ResponsiveContainer>
    </div>
  );
}, categoryListPropsAreEqual);

CategoryListWidget.propTypes = {
  settings: PropTypes.shape().isRequired,
  fetchCategory: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.shape()),
};

CategoryListWidget.defaultProps = {
  fetchCategory: () => {},
  items: null,
};

CategoryListWidget.displayName = 'CategoryListWidget';

export default connect(CategoryListWidget);

export { CategoryListWidget as Unwrapped };
