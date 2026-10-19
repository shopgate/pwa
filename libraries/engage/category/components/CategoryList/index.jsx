import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import Portal from '@shopgate/pwa-common/components/Portal';
import { Placeholder } from '@shopgate/pwa-ui-shared';
import {
  CATEGORY_ITEM,
  CATEGORY_SHOW_ALL_PRODUCTS,
} from '@shopgate/pwa-common-commerce/category/constants/Portals';
import { i18n } from '@shopgate/engage/core/helpers';
import { getShowAllProductsFilters } from '@shopgate/engage/category';
import { SheetList, TextLink } from '@shopgate/engage/components';
import { useCategoryImageRatio } from '@shopgate/engage/category/hooks';
import CategoryImage from '../CategoryImage';
import CategoryGrid from '../CategoryGrid';

const LEFT_IMAGE_HEIGHT = 30;
const LEFT_IMAGE_REQUEST_WIDTH = 270;

const useStyles = makeStyles()((theme, { leftImageWidth }) => ({
  sheet: {
    background: theme.palette.background.surface,
  },
  showAllProducts: {
    fontWeight: theme.typography.fontWeightBold,
  },
  image: {
    width: '30px',
    marginRight: 8,
  },
  leftImage: {
    width: leftImageWidth,
    marginRight: 8,
  },
  imageFallback: {
    width: '100%',
    height: '100%',
    background: theme.palette.background.emphasized,
  },
}));

/**
 * The CategoryList component.
 * @param {Object} props The component props.
 * @param {Object} props.parentCategory The parentCategory props.
 * @param {Array} props.categories The categories to display.
 * @param {number} props.prerender The number of rows to prerender.
 * @param {boolean} props.showAllProducts Whether to show all products
 * @param {boolean} props.showImages Whether to show category images
 * @param {boolean} props.showLeftSideImages Whether to show category images on the left side
 * @param {string} props.layout Whether the categories are shown as a list or as a grid
 * @param {boolean} props.labelled Whether the grid names itself, off inside a named section
 * @returns {JSX.Element}
 */
const CategoryList = ({
  categories,
  parentCategory,
  prerender,
  showAllProducts,
  showImages,
  showLeftSideImages,
  layout,
  labelled,
}) => {
  const leftImage = useCategoryImageRatio(LEFT_IMAGE_REQUEST_WIDTH, LEFT_IMAGE_HEIGHT);
  const { classes, cx } = useStyles({ leftImageWidth: leftImage.thumbnailWidth });

  if (layout === 'grid') {
    return (
      <CategoryGrid
        categories={categories}
        prerender={prerender}
        parentCategory={parentCategory}
        showAllProducts={showAllProducts}
        labelled={labelled}
      />
    );
  }
  if (!categories || !categories.length) {
    if (prerender === 0) {
      return null;
    }

    return (
      <SheetList className={cx(classes.sheet, 'engage__category__category-list')}>
        {Array(Math.min(prerender, 8)).fill('').map((val, index) => {
          const key = `placeholder-${index}`;
          return <Placeholder height={20} key={key} left={0} top={18} width={220} />;
        })}
      </SheetList>
    );
  }

  const filters = getShowAllProductsFilters(parentCategory);

  return (
    <SheetList className={cx(classes.sheet, 'engage__category__category-list')}>
      {showAllProducts ?
        <div className={cx(classes.showAllProducts, 'engage__category__category-show-all-products')}>
          <Portal
            key={parentCategory.id}
            name={CATEGORY_SHOW_ALL_PRODUCTS}
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
        null}
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
                ? <CategoryImage className={classes.image} src={category.imageUrl} />
                : null
            }
            leftComponent={
              showLeftSideImages
                ? (
                  <CategoryImage
                    className={classes.leftImage}
                    src={category.imageUrl}
                    ratio={leftImage.ratio}
                    resolutions={leftImage.resolutions}
                    fallback={<div className={classes.imageFallback} />}
                  />
                )
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
  labelled: PropTypes.bool,
  layout: PropTypes.oneOf(['list', 'grid']),
  parentCategory: PropTypes.shape(),
  prerender: PropTypes.number,
  showAllProducts: PropTypes.bool,
  showImages: PropTypes.bool,
  showLeftSideImages: PropTypes.bool,
};

CategoryList.defaultProps = {
  categories: null,
  labelled: true,
  layout: 'list',
  parentCategory: null,
  prerender: 0,
  showAllProducts: false,
  showImages: false,
  showLeftSideImages: false,
};

export default CategoryList;
