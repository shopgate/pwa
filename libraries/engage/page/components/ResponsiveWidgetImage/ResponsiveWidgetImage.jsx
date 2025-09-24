import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTheme, makeStyles } from '@shopgate/engage/styles';
import { parseImageUrl } from '../../helpers';

/** @typedef {import('@shopgate/engage/styles').Theme} Theme */
/** @typedef {Theme['breakpoints']['keys'][0]} Breakpoint */
/** @typedef {React.ImgHTMLAttributes<HTMLImageElement>} ImgProps */
/** @typedef {{breakpoint: Breakpoint} & ImgProps} ResponsiveImageProps */

const useStyles = makeStyles()({
  preventSave: {
    userSelect: 'none',
    ' img': {
      userSelect: 'none',
      pointerEvents: 'none',
    },
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
  ...imgProps
}) => {
  const { breakpoints } = useTheme();
  const { classes } = useStyles();
  const src2x = useMemo(() => parseImageUrl(src, true), [src]);

  if (!src) {
    return null;
  }

  return (
    <picture
      onContextMenu={e => e.preventDefault()}
      className={classes.preventSave}
    >
      <source media={`(width >= ${breakpoints.values[breakpoint]}px)`} srcSet={src2x} />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        {...imgProps}
      />
    </picture>
  );
};

ResponsiveWidgetImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  breakpoint: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
};

ResponsiveWidgetImage.defaultProps = {
  alt: null,
  breakpoint: 'md',
};

export default ResponsiveWidgetImage;
