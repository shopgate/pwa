import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/engage/components';
import {
  CATEGORY_LIST,
  CATEGORY_LIST_AFTER,
  CATEGORY_LIST_BEFORE,
} from '@shopgate/engage/category';
import CategoryList from 'Components/CategoryList';
import connect from './connector';

/**
 * The category list content.
 */
class CategoryListContent extends PureComponent {
  static propTypes = {
    categoryId: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.shape()),
    childrenCount: PropTypes.number,
    hasChildren: PropTypes.bool,
  };

  static defaultProps = {
    categories: null,
    childrenCount: 6,
    hasChildren: false,
  }

  /**
   * @returns {JSX}
   */
  render() {
    const {
      hasChildren, categories, categoryId, childrenCount,
    } = this.props;

    return (
      <Fragment>
        <Portal name={CATEGORY_LIST_BEFORE} props={{ categoryId }} />
        <Portal name={CATEGORY_LIST} props={{ categoryId }}>
          {hasChildren && (
            <CategoryList categories={categories} prerender={childrenCount} />
          )}
        </Portal>
        <Portal name={CATEGORY_LIST_AFTER} props={{ categoryId }} />
      </Fragment>
    );
  }
}

export default connect(CategoryListContent);
