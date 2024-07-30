import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  CATEGORY_LIST,
  CATEGORY_LIST_AFTER,
  CATEGORY_LIST_BEFORE,
} from '@shopgate/pwa-common-commerce/category/constants/Portals';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import { Section } from '@shopgate/engage/a11y';
import { CategoryList } from '@shopgate/engage/category/components';
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
  };

  static defaultProps = {
    categories: null,
    category: null,
    categoriesFetching: false,
    childrenCount: 6,
    hasChildren: false,
  }

  /**
   * @returns {JSX}
   */
  render() {
    const {
      hasChildren, category, categories, categoryId, childrenCount, categoriesFetching,
    } = this.props;

    return (
      <Fragment>
        <Portal name={CATEGORY_LIST_BEFORE} props={{ categoryId }} />
        <Portal name={CATEGORY_LIST} props={{ categoryId }}>
          {hasChildren && (
            <Section title="category.sections.categories">
              <CategoryList
                categories={categories}
                prerender={categoriesFetching ? childrenCount : 0}
                // "show all products" feature is only supported by the "old" services
                showAllProducts={!hasNewServices() && showAllProducts}
                parentCategory={category}
              />
            </Section>
          )}
        </Portal>
        <Portal name={CATEGORY_LIST_AFTER} props={{ categoryId }} />
      </Fragment>
    );
  }
}

export default connect(CategoryListContent);
