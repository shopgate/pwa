import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { SheetList, TextLink } from '@shopgate/engage/components';
import { CategoryImage } from '@shopgate/engage/category';
import styles from './style';

/**
 * The CategoryListDefault component
 * @returns {JSX}
 */
const CategoryListDefault = ({ categories, settings }) => (
  <SheetList hasImages={settings.showImages} className={styles.sheetList}>
    {categories.map((category) => {
      // We have to decode the link before using it.
      const link = `/category/${bin2hex(category.id)}`;

      // Only show an avatar if the setting `showImages` is true.
      const Avatar = settings.showImages && category.imageUrl ? (
        <CategoryImage src={category.imageUrl} />
      ) : null;

      return (
        <SheetList.Item
          image={Avatar}
          link={link}
          key={category.id}
          title={category.name}
          testId={category.name}
          rightComponent={<CategoryImage className={styles.image} src={category.imageUrl} />}
          linkComponent={TextLink}
        />
      );
    })}
  </SheetList>
);

CategoryListDefault.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  settings: PropTypes.shape().isRequired,
};

export default CategoryListDefault;
