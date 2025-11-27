import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { Link, ConditionalWrapper, Grid } from '@shopgate/engage/components';
import { useImageRowWidget } from './hooks';
import ResponsiveWidgetImage from '../../components/ResponsiveWidgetImage';

const useStyles = makeStyles()((theme, {
  imageSpacing,
  slidesPerViewCustomLarge,
  slidesPerViewCustomMedium,
  slidesPerViewCustomSmall,
}) => ({
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
  imageContainerCustom: {
    [theme.breakpoints.up('lg')]: {
      flex: `1 1 calc(${100 / slidesPerViewCustomLarge}% - ${imageSpacing}px)`,
    },
    [theme.breakpoints.between('sm', 'lg')]: {
      flex: `1 1 calc(${100 / slidesPerViewCustomMedium}% - ${imageSpacing}px)`,
    },
    [theme.breakpoints.down('sm')]: {
      flex: `1 1 calc(${100 / slidesPerViewCustomSmall}% - ${imageSpacing}px)`,
    },
  },
}));

/**
 * The ImageRowWidget is used to display images in one or more rows.
 * @returns {JSX.Element}
 */
const ImageRow = () => {
  const {
    images,
    imageWrapping = 'responsiveDefault',
    imageSpacing,
    borderRadius,
    parallax,
    slidesPerViewCustomLarge,
    slidesPerViewCustomMedium,
    slidesPerViewCustomSmall,
  } = useImageRowWidget();

  const { cx, classes } = useStyles({
    imageSpacing,
    slidesPerViewCustomLarge,
    slidesPerViewCustomMedium,
    slidesPerViewCustomSmall,
  });

  if (images.length === 0) return null;

  return (
    <Grid className={classes.imageContainer} component="div">
      {images.map(img => (
        <Grid.Item
          key={img.url}
          component="div"
          className={cx({
            [classes.itemContainerDefault]: imageWrapping === 'responsiveDefault',
            [classes.itemContainerDense]: imageWrapping === 'responsiveDense',
            [classes.itemContainerNoWrap]: imageWrapping === 'responsiveNoWrap',
            [classes.imageContainerCustom]: imageWrapping === 'responsiveCustom',
          })}
        >
          <ConditionalWrapper
            condition={!!img.link}
            wrapper={children => (
              <Link href={img.link} className={classes.image}>
                {children}
              </Link>
            )}
          >
            <ResponsiveWidgetImage
              src={img.url}
              alt={img.altText}
              className={classes.image}
              borderRadius={borderRadius}
              enableParallax={parallax}
            />
          </ConditionalWrapper>
        </Grid.Item>
      ))}
    </Grid>
  );
};
export default ImageRow;
