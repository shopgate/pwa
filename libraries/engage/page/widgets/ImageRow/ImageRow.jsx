import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { Link, ConditionalWrapper, Grid } from '@shopgate/engage/components';
import { useImageRowWidget } from './hooks';
import ResponsiveWidgetImage from '../../components/ResponsiveWidgetImage';

const useStyles = makeStyles()((theme, { imageSpacing, borderRadius }) => ({
  imageContainer: {
    width: '100%',
    display: 'flex',
    overflowX: 'hidden',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: `${imageSpacing}px`,
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    flexShrink: 1,
    display: 'block',
    width: '100%',
    objectFit: 'contain',
    borderRadius,
  },
  itemContainerDense: {
    [theme.breakpoints.down('md')]: {
      flex: `1 1 calc(33% - ${imageSpacing}px)`,
    },
    [theme.breakpoints.up('md')]: {
      flex: `1 1 calc(16% - ${imageSpacing}px)`,
    },
  },
  itemContainerDefault: {
    [theme.breakpoints.down('md')]: {
      flex: `1 1 calc(50% - ${imageSpacing}px)`,
    },
    [theme.breakpoints.up('md')]: {
      flex: `1 1 calc(25% - ${imageSpacing}px)`,
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
  const {
    images, imageWrapping, imageSpacing, borderRadius,
  } = useImageRowWidget();

  const { cx, classes } = useStyles({ imageSpacing, borderRadius });

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
            <ResponsiveWidgetImage
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
