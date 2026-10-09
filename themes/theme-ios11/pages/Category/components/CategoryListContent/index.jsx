import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  CATEGORY_LIST,
  CATEGORY_LIST_AFTER,
  CATEGORY_LIST_BEFORE,
} from '@shopgate/pwa-common-commerce/category/constants/Portals';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import { Section } from '@shopgate/engage/a11y';
import { CategoryList } from '@shopgate/engage/category/components';
import connect from './connector';

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
    layout: PropTypes.oneOf(['list', 'grid']),
    showAllProducts: PropTypes.bool,
    showImages: PropTypes.bool,
    showList: PropTypes.bool,
  };

  static defaultProps = {
    categories: null,
    category: null,
    categoriesFetching: false,
    childrenCount: 6,
    hasChildren: false,
    layout: 'list',
    showAllProducts: false,
    showImages: false,
    showList: true,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const {
      hasChildren, category, categories, categoryId, childrenCount, categoriesFetching,
      layout, showImages, showAllProducts, showList,
    } = this.props;

    return (
      <>
        <Portal name={CATEGORY_LIST_BEFORE} props={{ categoryId }} />
        {showList && (
        <Portal name={CATEGORY_LIST} props={{ categoryId }}>
          {hasChildren && (
            <Section title="category.sections.categories">
              <CategoryList
                categories={categories}
                prerender={categoriesFetching ? childrenCount : 0}
                // "show all products" feature is only supported by the "old" services
                showAllProducts={!hasNewServices() && showAllProducts}
                parentCategory={category}
                layout={layout}
                showLeftSideImages={layout === 'list' && showImages}
              />
            </Section>
          )}
        </Portal>
        )}
        <Portal name={CATEGORY_LIST_AFTER} props={{ categoryId }} />
      </>
    );
  }
}

export default connect(CategoryListContent);
