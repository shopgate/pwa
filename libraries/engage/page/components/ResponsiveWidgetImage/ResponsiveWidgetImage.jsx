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

  const reduceMotion = useReduceMotion();

  const parallax = useParallax({
    // If parallax is to soft, increase the translateY values.
    translateY: [-15, 15],
    // If the scrolling image moves out of the viewport too early, increase the scale values.
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
    >
      <img
        src={imgSrc}
        ref={parallax.ref}
        alt={alt}
        loading="lazy"
        className={cx(classes.preventSave, className)}
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
