/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/engage/core';
import { CATEGORY_PATH, CATEGORY_ITEM, CategoryImage } from '@shopgate/engage/category';
import {
  Link, TextLink, Portal,
} from '@shopgate/engage/components';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;
const minImageSize = 110;

const useStyles = makeStyles()(theme => ({
  gridItem: {
    width: '50%',
    display: 'flex',
    ':nth-of-type(even)': {
      padding: theme.spacing(0, 0, 2, 1),
    },
    ':nth-of-type(odd)': {
      padding: theme.spacing(0, 1, 2, 0),
    },
    '&:nth-of-type(2n+1):nth-last-of-type(-n+2), &:nth-of-type(2n+1):nth-last-of-type(-n+2) ~ li': {
      paddingBottom: 0,
    },
  },
  gridItemInner: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    minHeight: minImageSize,
    border: `1px solid ${colors.shade7}`,
  },
  gridItemColumnLeft: {
    flex: 1,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  gridItemColumnRight: {
    width: '20%',
    minWidth: minImageSize,
  },
  categoryTitle: {
    fontSize: '1.5rem',
    lineHeight: '1.5rem',
    margin: 'auto',
    [responsiveMediaQuery('<=sm', { webOnly: true })]: {
      fontSize: '1.25rem',
      lineHeight: '1.25rem',
    },
  },
  categoryDescription: {
    color: 'var(--color-text-medium-emphasis)',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: 'initial',
    paddingTop: theme.spacing(1),
    ':empty': {
      display: 'none',
    },
  },
  categoryImage: {
    display: 'flex',
    width: '100%',
    ' img': {
      width: 'inherit !important',
      maxWidth: 'inherit !important',
    },
  },
}));

/**
 * The CategoryGridItem component
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const CategoryGridItem = ({ category, showImages }) => {
  const { classes } = useStyles();

  return (
    <Portal key={category.id} name={CATEGORY_ITEM} props={{ categoryId: category.id }}>
      <li className={classes.gridItem}>
        <Link
          className={classes.gridItemInner}
          href={`${CATEGORY_PATH}/${bin2hex(category.id)}`}
          state={{
            categoryId: category.id,
            title: category.name,
          }}
        >
          <div className={classes.gridItemColumnLeft}>
            <TextLink
              className={classes.categoryTitle}
              href={`${CATEGORY_PATH}/${bin2hex(category.id)}`}
              state={{
                categoryId: category.id,
                title: category.name,
              }}
            >
              <span dangerouslySetInnerHTML={{ __html: category.name }} />
            </TextLink>
            <div
              className={classes.categoryDescription}
              dangerouslySetInnerHTML={{ __html: category.description }}
            />
          </div>
          { showImages && (
            <div className={classes.gridItemColumnRight}>
              <CategoryImage className={classes.categoryImage} src={category.imageUrl} />
            </div>
          )}
        </Link>
      </li>
    </Portal>
  );
};

CategoryGridItem.propTypes = {
  category: PropTypes.shape().isRequired,
  showImages: PropTypes.bool,
};

CategoryGridItem.defaultProps = {
  showImages: true,
};

export default CategoryGridItem;

/* eslint-enable react/no-danger */
