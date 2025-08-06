import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import Portal from '@shopgate/pwa-common/components/Portal';
import { Placeholder } from '@shopgate/pwa-ui-shared';
import { CATEGORY_ITEM } from '@shopgate/pwa-common-commerce/category/constants/Portals';
import { i18n } from '@shopgate/engage/core';
import { getShowAllProductsFilters } from '@shopgate/engage/category';
import { SheetList, TextLink } from '@shopgate/engage/components';
import CategoryImage from '../CategoryImage';
import styles from './style';

/**
 * The CategoryList component.
 * @param {Object} props The component props.
 * @param {Object} props.parentCategory The parentCategory props.
 * @param {Array} props.categories The categories to display.
 * @param {number} props.prerender The number of rows to prerender.
 * @param {boolean} props.showAllProducts Whether to show all products
 * @param {boolean} props.showImages Whether to show category images
 * @param {boolean} props.showLeftSideImages Whether to show category images on the left side
 * @returns {JSX.Element}
 */
const CategoryList = ({
  categories,
  parentCategory,
  prerender,
  showAllProducts,
  showImages,
  showLeftSideImages,
}) => {
  if (!categories || !categories.length) {
    if (prerender === 0) {
      return null;
    }

    return (
      <SheetList className={classNames(styles.sheet, 'engage__category__category-list')}>
        {Array(Math.min(prerender, 8)).fill('').map((val, index) => {
          const key = `placeholder-${index}`;
          return <Placeholder height={20} key={key} left={0} top={18} width={220} />;
        })}
      </SheetList>
    );
  }

  const filters = getShowAllProductsFilters(parentCategory);

  return (
    <SheetList className={classNames(styles.sheet, 'engage__category__category-list')}>
      {showAllProducts ?
        <div className={classNames(styles.showAllProducts, 'engage__category__category-show-all-products')}>
          <Portal
            key={parentCategory.id}
            name="category.show-all-products"
            props={{ categoryId: parentCategory.id }}
          >
            <SheetList.Item
              link={`${CATEGORY_PATH}/${bin2hex(parentCategory.id)}/all`}
              title={i18n.text('category.showAllProducts.label')}
              linkState={{
                categoryName: parentCategory.name,
                categoryId: parentCategory.id,
                filters,
              }}
              testId="showAllProducts"
              linkComponent={TextLink}
            />
          </Portal>
        </div>
        :
        null
      }
      {categories.map(category => (
        <Portal key={category.id} name={CATEGORY_ITEM} props={{ categoryId: category.id }}>
          <SheetList.Item
            link={`${CATEGORY_PATH}/${bin2hex(category.id)}`}
            title={category.name}
            description={category.description}
            linkState={{
              categoryId: category.id,
              title: category.name,
            }}
            testId={category.name}
            rightComponent={
                showImages
                  ? <CategoryImage className={styles.image} src={category.imageUrl} />
                  : null
              }
            leftComponent={
                showLeftSideImages
                  ? <CategoryImage className={styles.image} src={category.imageUrl} />
                  : null
              }
            linkComponent={TextLink}
          />
        </Portal>
      ))}
    </SheetList>
  );
};

CategoryList.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape()),
  parentCategory: PropTypes.shape(),
  prerender: PropTypes.number,
  showAllProducts: PropTypes.bool,
  showImages: PropTypes.bool,
  showLeftSideImages: PropTypes.bool,
};

CategoryList.defaultProps = {
  categories: null,
  parentCategory: null,
  prerender: 0,
  showAllProducts: false,
  showImages: false,
  showLeftSideImages: false,
};

export default CategoryList;
