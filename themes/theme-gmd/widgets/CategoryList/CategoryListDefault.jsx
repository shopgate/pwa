import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { SheetList, TextLink } from '@shopgate/engage/components';
import { CategoryImage } from '@shopgate/engage/category';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const useStyles = makeStyles()(theme => ({
  sheetList: {
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      ' > li': {
        boxShadow: 'none !important',
        padding: theme.spacing(1, 0),
        '&:first-of-type': {
          paddingTop: 0,
        },
        '&:last-of-type': {
          paddingBottom: 0,
        },
        '> :first-of-type': {
          border: `1px solid ${colors.shade7}`,
        },
      },
    },
  },
  image: {
    display: 'none',
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      display: 'flex',
      '& img': {
        position: 'inherit',
        width: 'inherit !important',
        maxWidth: 'inherit !important',
        height: theme.spacing(8),
      },
    },
  },
}));

/**
 * The CategoryListDefault component
 * @returns {JSX}
 */
const CategoryListDefault = ({ categories, settings }) => {
  const { classes } = useStyles();

  return (
    <SheetList hasImages={settings.showImages} className={classes.sheetList}>
      {categories.map((category) => {
        const link = `/category/${bin2hex(category.id)}`;

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
            rightComponent={<CategoryImage className={classes.image} src={category.imageUrl} />}
            linkComponent={TextLink}
          />
        );
      })}
    </SheetList>
  );
};

CategoryListDefault.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  settings: PropTypes.shape().isRequired,
};

export default CategoryListDefault;
