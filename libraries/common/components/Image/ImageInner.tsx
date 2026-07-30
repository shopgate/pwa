import { forwardRef } from 'react';
import type { CSSProperties, SyntheticEvent } from 'react';
import noop from 'lodash/noop';
import { makeStyles } from '@shopgate/engage/styles';

export interface ImageInnerProps {
  /**
   * Alt text. Without one the image is marked decorative.
   */
  alt?: string | null;
  /**
   * External class name for the img element.
   */
  className?: string | null;
  /**
   * Microdata property name, e.g. "image" for a schema.org Product. Emitted as the itemprop
   * attribute so crawlers can pick the image out of the surrounding item.
   */
  itemProp?: string;
  /**
   * Whether the browser defers loading until the image is near the viewport.
   */
  lazy?: boolean;
  /**
   * Callback that is invoked when image loading failed.
   */
  onError?: (event: SyntheticEvent<HTMLImageElement>) => void;
  /**
   * Callback that is invoked when the image has been loaded.
   */
  onLoad?: (event: SyntheticEvent<HTMLImageElement>) => void;
  /**
   * The resolved image url.
   */
  src?: string | null;
  /**
   * Inline styles, used to pin the aspect ratio and paint the preview behind the image.
   */
  style?: CSSProperties | null;
}

const useStyles = makeStyles()({
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    maxHeight: '100%',
    WebkitTouchCallout: 'none',
    fontSize: 0,
    objectFit: 'contain',
  },
});

/**
 * The ImageInner component renders tha actual image of the Image component.
 * @param props The component props.
 * @param ref The component reference.
 * @returns The rendered component.
 */
const ImageInner = forwardRef<HTMLImageElement, ImageInnerProps>((props, ref) => {
  const {
    src = null,
    className = null,
    alt = null,
    itemProp,
    lazy = false,
    onLoad = noop,
    onError = noop,
    style = null,
  } = props;

  const { classes, cx } = useStyles();

  return (
    <img
      ref={ref}
      loading={lazy ? 'lazy' : 'eager'}
      src={src ?? undefined}
      className={cx(
        classes.image,
        'common__image',
        className
      )}
      alt={alt ?? undefined}
      aria-label={alt ?? undefined}
      aria-hidden={!alt}
      data-test-id="image"
      itemProp={itemProp}
      onLoad={onLoad}
      onError={onError}
      style={style ?? undefined}
    />
  );
});

export default ImageInner;
