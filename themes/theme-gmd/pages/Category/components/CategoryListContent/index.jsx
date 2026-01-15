import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  CATEGORY_LIST,
  CATEGORY_LIST_AFTER,
  CATEGORY_LIST_BEFORE,
} from '@shopgate/pwa-common-commerce/category/constants/Portals';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { Section } from '@shopgate/engage/a11y';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { CategoryList } from '@shopgate/engage/category/components';
import CategoryGrid from 'Components/CategoryGrid';
import connect from './connector';

const showAllProducts = appConfig.categoriesShowAllProducts;

/**
 * The category list content.
 */
class CategoryListContent extends PureComponent {
  static propTypes = {
    categoryId: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.shape()),
    categoriesFetching: PropTypes.bool,
    category: PropTypes.shape(),
    childrenCount: PropTypes.number,
    hasChildren: PropTypes.bool,
    showCategoryImages: PropTypes.bool,
  };

  static defaultProps = {
    categories: null,
    category: null,
    categoriesFetching: false,
    childrenCount: 6,
    hasChildren: false,
    showCategoryImages: true,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const {
      hasChildren, category, categories, categoryId, childrenCount, categoriesFetching,
    } = this.props;

    return (
      <>
        <Portal name={CATEGORY_LIST_BEFORE} props={{ categoryId }} />
        <Portal name={CATEGORY_LIST} props={{ categoryId }}>
          {hasChildren && (
            <Section title="category.sections.categories">
              <ResponsiveContainer appAlways breakpoint="<=xs">
                <CategoryList
                  categories={categories}
                  prerender={categoriesFetching ? childrenCount : 0}
                  // "show all products" feature is only supported by the "old" services
                  showAllProducts={!hasNewServices() && showAllProducts}
                  parentCategory={category}
                  showImages={this.props.showCategoryImages}
                />
              </ResponsiveContainer>
              <ResponsiveContainer webOnly breakpoint=">xs">
                <CategoryGrid
                  categories={categories}
                  prerender={categoriesFetching ? childrenCount : 0}
                  showImages={this.props.showCategoryImages}
                />
              </ResponsiveContainer>
            </Section>
          )}
        </Portal>
        <Portal name={CATEGORY_LIST_AFTER} props={{ categoryId }} />
      </>
    );
  }
}

export default connect(CategoryListContent);
