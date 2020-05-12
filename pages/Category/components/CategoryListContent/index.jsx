import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  CATEGORY_LIST,
  CATEGORY_LIST_AFTER,
  CATEGORY_LIST_BEFORE,
} from '@shopgate/pwa-common-commerce/category/constants/Portals';
import { Section } from '@shopgate/engage/a11y';
import { ResponsiveContainer } from '@shopgate/engage/components';
import CategoryList from 'Components/CategoryList';
import CategoryGrid from 'Components/CategoryGrid';
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
            <Section title="category.sections.categories">
              <ResponsiveContainer appAlways breakpoint="<=xs">
                <CategoryList categories={categories} prerender={childrenCount} />
              </ResponsiveContainer>
              <ResponsiveContainer webOnly breakpoint=">xs">
                <CategoryGrid categories={categories} prerender={childrenCount} />
              </ResponsiveContainer>
            </Section>
          )}
        </Portal>
        <Portal name={CATEGORY_LIST_AFTER} props={{ categoryId }} />
      </Fragment>
    );
  }
}

export default connect(CategoryListContent);
