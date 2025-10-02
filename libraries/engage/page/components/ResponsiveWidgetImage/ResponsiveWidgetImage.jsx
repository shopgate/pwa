import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useResponsiveValue } from '@shopgate/engage/styles';
import { useParallax } from 'react-scroll-parallax';
import { useReduceMotion } from '@shopgate/engage/a11y/hooks';
import { parseImageUrl } from '../../helpers';

/** @typedef {import('@shopgate/engage/styles').Theme} Theme */
/** @typedef {Theme['breakpoints']['keys'][0]} Breakpoint */
/** @typedef {React.ImgHTMLAttributes<HTMLImageElement>} ImgProps */
/** @typedef {{breakpoint: Breakpoint} & ImgProps} ResponsiveImageProps */

const useStyles = makeStyles()({
  preventSave: {
    userSelect: 'none',
    pointerEvents: 'none',
  },
  container: {
    width: '100%',
    overflow: 'hidden',
    border: '2px solid red',
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
  ...imgProps
}) => {
  const { classes, cx } = useStyles();
  const [imageHeight, setImageHeight] = React.useState(0);

  const reduceMotion = useReduceMotion();

  /**
   * Handles the image load event to set the image height.
   * @param {Object} event The load event.
   */
  const handleImageLoad = (event) => {
    setImageHeight(event.target.clientHeight);
  };

  const parallax = useParallax({
    translateY: [-15, 15],
    scale: [1.3, 1.3],
    disabled: reduceMotion || !enableParallax,
  });

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
      className={cx(classes.container)}
      style={{ height: imageHeight }}
    >
      <img
        src={imgSrc}
        ref={parallax.ref}
        alt={alt}
        loading="lazy"
        className={cx(classes.preventSave, className)}
        onLoad={handleImageLoad}
        {...imgProps}
      />
    </div>
  );
};

ResponsiveWidgetImage.propTypes = {
  alt: PropTypes.string,
  breakpoint: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  enableParallax: PropTypes.bool,
  src: PropTypes.string,
};

ResponsiveWidgetImage.defaultProps = {
  src: null,
  alt: null,
  breakpoint: 'md',
  className: null,
  enableParallax: false,
};

export default ResponsiveWidgetImage;
