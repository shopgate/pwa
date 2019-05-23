import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/engage/core';
import { CATEGORY_PATH } from '@shopgate/engage/category';
import { Portal } from '@shopgate/engage/components';
import { Placeholder } from '@shopgate/engage/components';
import { CATEGORY_ITEM } from '@shopgate/engage/category';
import { SheetList } from '@shopgate/engage/components';
import styles from './style';

/**
 * The CategoryList component.
 * @param {Object} props The component props.
 * @param {Array} props.categories The categories to display.
 * @param {Array} props.categories The number of rows to prerender.
 * @returns {JSX}
 */
const CategoryList = ({ categories, prerender }) => {
  if (!categories || !categories.length) {
    if (prerender === 0) {
      return null;
    }

    return (
      <SheetList className={styles}>
        {[...Array(prerender)].map((val, index) => {
          const key = `placeholder-${index}`;
          return <Placeholder height={20} key={key} left={0} top={18} width={220} />;
        })}
      </SheetList>
    );
  }

  return (
    <SheetList className={styles}>
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
  prerender: PropTypes.number,
};

CategoryList.defaultProps = {
  categories: null,
  prerender: 0,
};

export default CategoryList;
