import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import Portal from '@shopgate/pwa-common/components/Portal';
import { Placeholder } from '@shopgate/pwa-ui-shared';
import { CATEGORY_ITEM } from '@shopgate/pwa-common-commerce/category/constants/Portals';
import { SheetList, Image, TextLink } from '@shopgate/engage/components';
import styles, { image } from './style';

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
        {Array(prerender).fill('').map((val, index) => {
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
            description={category.description}
            linkState={{
              categoryId: category.id,
              title: category.name,
            }}
            testId={category.name}
            rightComponent={<Image className={image} src={category.imageUrl} />}
            linkComponent={TextLink}
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
