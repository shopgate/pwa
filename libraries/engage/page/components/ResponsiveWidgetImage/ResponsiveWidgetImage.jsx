import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useResponsiveValue } from '@shopgate/engage/styles';
import { useParallax } from 'react-scroll-parallax';
import { useReduceMotion } from '@shopgate/engage/a11y/hooks';
import { parseImageUrl } from '../../helpers';

/**
 * @typedef {Object} CustomResponsiveImageProps
 * @property {boolean} [enableParallax] Whether to enable the parallax effect.
 * @property {number} [borderRadius] The border radius to apply to the image.
 * @property {Breakpoint} [breakpoint] The breakpoint from which on a higher resolution image should
 * be loaded.
 * @property {boolean} [isBanner] Whether the image is used as a banner (full width and height of
 * its container).
 */

/** @typedef {import('@shopgate/engage/styles').Theme} Theme */
/** @typedef {Theme['breakpoints']['keys'][0]} Breakpoint */
/** @typedef {React.ImgHTMLAttributes<HTMLImageElement>} ImgProps */
/** @typedef {CustomResponsiveImageProps & ImgProps} ResponsiveImageProps */

const useStyles = makeStyles()({
  preventSave: {
    userSelect: 'none',
    pointerEvents: 'none',
  },
  image: {
    width: '100%',
  },
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  bannerContainer: {
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  banner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

/**
 * The ResponsiveWidgetImage component renders an image that adapts to different screen sizes.
 * It renders a image with higher resolution on larger screens
 * It can apply a parallax effect when scrolling.
 *
 * @param {ResponsiveImageProps} props The component props.
 * @returns {JSX.Element}
 */
const ResponsiveWidgetImage = ({
  src,
  alt,
  breakpoint,
  className,
  enableParallax = false,
  isBanner = false,
  borderRadius = 0,
  ...imgProps
}) => {
  const { classes, cx } = useStyles();

  const [containerRatio, setContainerRatio] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  const reduceMotion = useReduceMotion();

  // If parallax is to soft, increase this value.
  const parallaxPercent = 15;
  const parallax = useParallax({
    translateY: [`-${parallaxPercent}`, `${parallaxPercent}`],
    disabled: reduceMotion || !enableParallax,
  });

  /**
   * Handles the image load event
   * We set the aspect ratio of the container based on the image dimensions
   * to prevent white spaces in the layout while the image is moving.
   * The aspect ratio is calculated with the parallaxPercent
   * @param {Object} event The load event.
   */
  const handleImageLoad = (event) => {
    const width = event.target.clientWidth;
    const height = event.target.clientHeight;

    const heightReduction = enableParallax ? (height / 100 * (parallaxPercent + 10)) : 0;
    setContainerRatio(`${width}/${height - heightReduction}`);
    setImageHeight(event.target.clientHeight);
  };
  const src2x = useMemo(() => parseImageUrl(src, true), [src]);
  const imgSrc = useResponsiveValue({
    xs: src,
    [breakpoint]: src2x,
  });

  if (!src) {
    return null;
  }

  return (
    <div
      className={cx(
        [
          [isBanner && classes.bannerContainer],
          [!isBanner && classes.container],
        ]
      )}
      style={{
        borderRadius: `${borderRadius}px`,
        ...(!isBanner ? { aspectRatio: containerRatio } : {}),
      }}
    >
      <img
        src={imgSrc}
        ref={parallax.ref}
        alt={alt}
        loading="lazy"
        className={cx([
          classes.preventSave,
          classes.image,
          isBanner && classes.banner,
        ], className)}
        onLoad={handleImageLoad}
        style={{
          marginTop: enableParallax ? `-${imageHeight / 100 * (parallaxPercent - 10 / 2)}px` : 0,
          ...(enableParallax && isBanner ? { height: `${100 + parallaxPercent * 2}%` } : {}),
        }}
        {...imgProps}
      />
    </div>
  );
};

ResponsiveWidgetImage.propTypes = {
  alt: PropTypes.string,
  borderRadius: PropTypes.number,
  breakpoint: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  enableParallax: PropTypes.bool,
  isBanner: PropTypes.bool,
  src: PropTypes.string,
};

ResponsiveWidgetImage.defaultProps = {
  src: null,
  alt: null,
  breakpoint: 'md',
  className: null,
  enableParallax: false,
  isBanner: false,
  borderRadius: 0,
};

export default ResponsiveWidgetImage;
