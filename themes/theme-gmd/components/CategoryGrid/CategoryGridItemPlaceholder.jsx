import React from 'react';
import PropTypes from 'prop-types';
import { Placeholder, Image } from '@shopgate/engage/components';
import classNames from 'classnames';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;
const { small, big } = variables.gap;
const minImageSize = 110;

const useStyles = makeStyles()({
  gridItem: {
    width: '50%',
    display: 'flex',
    ':nth-of-type(even)': {
      padding: `0 0 ${big}px ${small}px`,
    },
    ':nth-of-type(odd)': {
      padding: `0 ${small}px ${big}px 0`,
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
    padding: big,
    display: 'flex',
    flexDirection: 'column',
  },
  gridItemColumnRight: {
    width: '20%',
    minWidth: minImageSize,
  },
  placeholder: {
    ' > * ': {
      margin: 'auto',
      marginLeft: 0,
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
});

/**
 * The CategoryGridItemPlaceholder component
 * @returns {JSX}
 */
const CategoryGridItemPlaceholder = ({ showImages }) => {
  const { classes } = useStyles();

  return (
    <li className={classes.gridItem}>
      <div className={classes.gridItemInner}>
        <div className={classNames(classes.gridItemColumnLeft, classes.placeholder)}>
          <Placeholder height="25px" width="80%" />
        </div>
        { showImages && (
          <div className={classes.gridItemColumnRight}>
            <Image className={classes.categoryImage} />
          </div>
        )}
      </div>
    </li>
  );
};

CategoryGridItemPlaceholder.propTypes = {
  showImages: PropTypes.bool,
};

CategoryGridItemPlaceholder.defaultProps = {
  showImages: true,
};

export default CategoryGridItemPlaceholder;
