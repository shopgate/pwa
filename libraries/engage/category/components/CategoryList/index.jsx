import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import Portal from '@shopgate/pwa-common/components/Portal';
import { Placeholder } from '@shopgate/pwa-ui-shared';
import { CATEGORY_ITEM } from '@shopgate/pwa-common-commerce/category/constants/Portals';
import { i18n } from '@shopgate/engage/core';
import { SheetList } from '../../../components';
import styles from './style';

/**
 * The CategoryList component.
 * @param {Object} props The component props.
 * @param {Array} props.categories The categories to display.
 * @param {Array} props.categories The number of rows to prerender.
 * @returns {JSX}
 */
const CategoryList = ({ categories, prerender, showAllProducts, categoryId }) => {
  if (!categories || !categories.length) {
    if (prerender === 0) {
      return null;
    }

    return (
      <SheetList className={`${styles} engage__category__category-list`}>
        {[...Array(prerender)].map((val, index) => {
          const key = `placeholder-${index}`;
          return <Placeholder height={20} key={key} left={0} top={18} width={220} />;
        })}
      </SheetList>
    );
  }

  return (
    <SheetList className={`${styles.sheet} engage__category__category-list`}>
      {showAllProducts ?
        <div className={styles.showAllProducts}>
          <Portal key={categoryId} name={CATEGORY_ITEM} props={{ categoryId }}>
            <SheetList.Item
              link={`${CATEGORY_PATH}/${bin2hex(categoryId)}/all`}
              title={i18n.text('category.showAllProducts.title')}
              linkState={{
                categoryId,
              }}
              testId="showAllProducts"
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
            linkState={{
              categoryId: category.id,
              title: category.name,
            }}
            testId={category.name}
          />
        </Portal>
      ))}
    </SheetList>
  );
};

CategoryList.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape()),
  categoryId: PropTypes.string,
  prerender: PropTypes.number,
  showAllProducts: PropTypes.bool,
};

CategoryList.defaultProps = {
  categories: null,
  categoryId: null,
  prerender: 0,
  showAllProducts: false,
};

export default CategoryList;
