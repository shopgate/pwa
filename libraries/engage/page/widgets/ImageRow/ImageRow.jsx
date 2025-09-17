import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { Link, ConditionalWrapper, Grid } from '@shopgate/engage/components';
import { useImageWidget } from './hooks';

const useStyles = makeStyles()(theme => ({
  imageContainer: {
    width: '100%',
    display: 'flex',
    overflowX: 'hidden',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    flexShrink: 1,
    display: 'block',
    width: '100%',
    objectFit: 'contain',
  },
  itemContainerDense: {
    [theme.breakpoints.down('md')]: {
      flex: '1 1 33%',
    },
    [theme.breakpoints.up('md')]: {
      flex: '1 1 16%',
    },
  },
  itemContainerDefault: {
    [theme.breakpoints.down('md')]: {
      flex: '1 1 50%',
    },
    [theme.breakpoints.up('md')]: {
      flex: '1 1 25%',
    },
  },
  itemContainerNoWrap: {
    flex: ' 1 1 0%',
  },
}));

/**
 * The ImageRowWidget is used to display images in one or more rows.
 * @returns {JSX.Element}
 */
const ImageRow = () => {
  const { cx, classes } = useStyles();

  const {
    images, imageWrapping,
  } = useImageWidget();

  if (images.length === 0) return null;

  return (
    <Grid className={cx(classes.imageContainer)} component="div">
      {images.map(img => (
        <Grid.Item
          key={img.url}
          component="div"
          className={cx({
            [classes.itemContainerDefault]: imageWrapping === 'responsiveDefault',
            [classes.itemContainerDense]: imageWrapping === 'responsiveDense',
            [classes.itemContainerNoWrap]: imageWrapping === 'responsiveNoWrap',
          })}
        >
          <ConditionalWrapper
            condition={!!img.link}
            wrapper={children => (
              <Link href={img.link} className={cx(classes.image)}>
                {children}
              </Link>
            )}
          >
            <img
              loading="lazy"
              src={img.url}
              alt={img.altText}
              className={cx(classes.image)}
            />
          </ConditionalWrapper>
        </Grid.Item>
      ))}
    </Grid>
  );
};
export default ImageRow;
