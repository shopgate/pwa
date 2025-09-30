import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useResponsiveValue } from '@shopgate/engage/styles';
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
});

/**
 * The ResponsiveWidgetImage component renders an image that adapts to different screen sizes.
 * It uses the <picture> element to provide a higher resolution image for medium and larger screens.
 *
 * @param {ResponsiveImageProps} props The component props.
 * @returns {JSX.Element}
 */
const ResponsiveWidgetImage = ({
  src,
  alt,
  breakpoint,
  className,
  ...imgProps
}) => {
  const { classes, cx } = useStyles();

  const src2x = useMemo(() => parseImageUrl(src, true), [src]);

  const imgSrc = useResponsiveValue({
    xs: src,
    [breakpoint]: src2x,
  });

  if (!src) {
    return null;
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      className={cx(classes.preventSave, className)}
      {...imgProps}
    />
  );
};

ResponsiveWidgetImage.propTypes = {
  alt: PropTypes.string,
  breakpoint: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  src: PropTypes.string,
};

ResponsiveWidgetImage.defaultProps = {
  src: null,
  alt: null,
  breakpoint: 'md',
  className: null,
};

export default ResponsiveWidgetImage;
