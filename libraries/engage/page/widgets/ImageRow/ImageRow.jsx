import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { Link, ConditionalWrapper } from '@shopgate/engage/components';
import { useImageWidget } from './hooks';

const useStyles = makeStyles()(() => ({
  imageContainer: {
    display: 'flex',
  },
  imageContainerDense: {
  },
  imageContainerDefault: {
  },
  imageContainerNoWrap: {
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageDense: {
    width: '33%',
  },
  imageDefault: {
    width: '50%',
  },
  imageNoWrap: {
    flex: 1,
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
    <div className={cx(classes.imageContainer, {
      [classes.imageContainerDefault]: imageWrapping === 'responsiveDefault',
      [classes.imageContainerDense]: imageWrapping === 'responsiveDense',
      [classes.imageContainerNoWrap]: imageWrapping === 'responsiveNoWrap',
    })}
    >
      {images.map(img => (
        <ConditionalWrapper
          key={img.url}
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
            className={cx(classes.image, {
              [classes.imageDefault]: imageWrapping === 'responsiveDefault',
              [classes.imageDense]: imageWrapping === 'responsiveDense',
              [classes.imageNoWrap]: imageWrapping === 'responsiveNoWrap',
            })}
          />
        </ConditionalWrapper>
      ))}
    </div>
  );
};
export default ImageRow;
