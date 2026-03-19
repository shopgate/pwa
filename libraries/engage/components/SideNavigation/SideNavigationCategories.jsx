import React, { useEffect } from 'react';
import { LoadingIndicator } from '@shopgate/pwa-ui-shared';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import SideNavigationCategoriesItemChildren from './SideNavigationCategoriesItemChildren';
import connect from './SideNavigationCategories.connector';

const { colors, variables } = themeConfig;

const useStyles = makeStyles()({
  list: {
    borderBottom: `1px solid ${colors.shade7}`,
  },
  loadingIndicator: {
    padding: 0,
    margin: 'auto',
  },
  item: {
    alignItems: 'center',
    display: 'flex',
    textAlign: 'left',
    outline: 0,
    padding: variables.gap.big,
    position: 'relative',
    width: '100%',
    lineHeight: '1.45em',
  },
});

/**
 * The SideNavigationCategories component.
 * @param {Object} props - The component props.
 * @property {string} [props.categoryId] - The ID of the category to fetch.
 * @property {boolean} [props.rootCategoriesFetching] - whether root categories are being fetched.
 * @property {Array} [props.subcategories] - The list of subcategories.
 * @property {Function} props.fetchCategory - Function to fetch the category data.
 * @returns {JSX.Element|null} The rendered component or null.
 */
const SideNavigationCategories = ({
  categoryId,
  subcategories,
  fetchCategory,
  rootCategoriesFetching,
}) => {
  const { classes } = useStyles();
  useEffect(() => {
    if (!subcategories) {
      fetchCategory(categoryId);
    }
  }, [categoryId, fetchCategory, subcategories]);

  if (!subcategories && rootCategoriesFetching) {
    return (
      <li className={classes.item}>
        <LoadingIndicator className={classes.loadingIndicator} />
      </li>
    );
  }

  if (!subcategories || (Array.isArray(subcategories) && subcategories.length === 0)) {
    return null;
  }

  return (
    <li className={classes.list}>
      <SideNavigationCategoriesItemChildren level={0} subcategories={subcategories} />
    </li>
  );
};

SideNavigationCategories.propTypes = {
  fetchCategory: PropTypes.func.isRequired,
  categoryId: PropTypes.string,
  rootCategoriesFetching: PropTypes.bool,
  subcategories: PropTypes.arrayOf(PropTypes.shape()),
};

SideNavigationCategories.defaultProps = {
  categoryId: null,
  rootCategoriesFetching: false,
  subcategories: null,
};

export default connect(SideNavigationCategories);
