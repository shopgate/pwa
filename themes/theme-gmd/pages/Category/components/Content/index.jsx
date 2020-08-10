import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useRoute } from '@shopgate/engage/core';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { GlobalLocationSwitcher } from '@shopgate/engage/locations';
import FilterBar from 'Components/FilterBar';
import ProductsContent from '../ProductsContent';
import Empty from '../Empty';
import CategoryListContent from '../CategoryListContent';
import connect from './connector';
import AppBar from '../AppBar';
import { filters } from './style';

/**
 * @param {Object} props.categoryId The category id.
 * @returns {JSX}
 */
const CategoryContent = ({ categoryId, hasChildren, hasProducts }) => {
  const { state } = useRoute();
  return (
    <Fragment>
      <AppBar hasProducts={hasProducts} hasChildren={hasChildren} />
      <CategoryListContent categoryId={categoryId} />

      <div className={filters}>
        <ResponsiveContainer appAlways breakpoint="<=xs">
          <GlobalLocationSwitcher renderBar standalone />
        </ResponsiveContainer>

        {hasProducts && (
          <FilterBar
            categoryId={categoryId}
            filters={state.filters}
          />
        )}

      </div>
      <ProductsContent categoryId={categoryId} hasProducts={hasProducts} />
      <Empty
        categoryId={categoryId}
        headlineText="category.no_result.heading"
        bodyText="category.no_result.body"
      />
    </Fragment>
  );
};

CategoryContent.propTypes = {
  categoryId: PropTypes.string.isRequired,
  hasChildren: PropTypes.bool,
  hasProducts: PropTypes.bool,
};

CategoryContent.defaultProps = {
  hasChildren: false,
  hasProducts: false,
};

export default connect(CategoryContent);
