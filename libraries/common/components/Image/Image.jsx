import React, {
  useMemo, useState, useEffect, useRef, useCallback, memo,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import noop from 'lodash/noop';
import { themeConfig } from '@shopgate/engage';
import { getFullImageSource } from '@shopgate/engage/core/helpers';
import styles from './style';
import ImageInner from './ImageInner';

const { colors: themeColors } = themeConfig;

/**
 * Calculates the Greatest Common Divisor (GCD) of two numbers using the Euclidean algorithm.
 *
 * @param {number} a - The first number (must be a positive integer).
 * @param {number} b - The second number (must be a positive integer).
 * @returns {number} The greatest common divisor of `a` and `b`.
 *
 * @example
 * gcd(1920, 1080); // Returns 120
 * gcd(10, 15);     // Returns 5
 * gcd(100, 25);    // Returns 25
 */
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

/**
 * The image component.
 * @param {Object} props The components props.
 * @returns {JSX.Element}
 */
const Image = ({
  alt,
  backgroundColor,
  className,
  classNameImg,
  forcePlaceholder: parentRendersPlaceholder,
  highestResolutionLoaded,
  onError,
  onLoad,
  ratio,
  resolutions,
  src,
  lazy,
  unwrapped,
}) => {
  // Prepare two image sources - a small preview image and a large main image. The idea is to
  // display an image as soon as possible. Small images might be also available in the cache from
  // the previous page.
  const sources = useMemo(
    () => {
      // Create a preview source when resolutions array has more than one element
      const preview = resolutions.length > 1
        ? getFullImageSource(src, resolutions[resolutions.length - 2])
        : null;

      // Create a main source when resolutions array has at least one element (highest resolution)
      const main = resolutions.length > 0
        ? getFullImageSource(src, resolutions[resolutions.length - 1])
        : null;

      return ({
        // Only assign preview source if it is different from the main source. Image swap logic
        // will not run when no preview source is available.
        preview: preview !== main ? preview : null,
        main,
      });
    },
    [resolutions, src]
  );

  const imgRef = useRef(null);
  const [isInView, setIsInView] = useState(!lazy);

  // Effect to create an Intersection Observer to enable lazy loading of preview images
  useEffect(() => {
    if (!lazy || !sources.preview) return undefined;

    // Intersection Observer to check if the image is in (or near) the viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // stop observing once visible
          observer.unobserve(entry.target);
        }
      },
      // load a bit earlier
      { rootMargin: '100px' }
    );

    if (imgRef.current) {
      // start observing the image element
      observer.observe(imgRef.current);
    }

    return () => {
      // disconnect the observer when the component is unmounted
      observer.disconnect();
    };
  }, [lazy, sources.preview]);

  /**
   * Handles the onLoad event of the image.
   */
  const handleOnLoad = useCallback((e) => {
    highestResolutionLoaded();
    onLoad(e);
  }, [highestResolutionLoaded, onLoad]);

  /**
   * Handles the onError event of the image.
   */
  const handleOnError = useCallback((e) => {
    onError(e);
  }, [onError]);

  /**
   * Memoized calculation of aspect ratio and CSS padding-hack ratio for responsive elements.
   *
   * Returns n object containing:
   * - `aspectRatio` {string} - The aspect ratio in the format `width / height` (e.g., `16 / 9`).
   * - `paddingHackRatio` {string} - The CSS padding-hack ratio as a percentage for older browsers
   * (e.g., `56.250%` for a 16:9 ratio).
   */
  const {
    aspectRatio,
    paddingHackRatio,
  } = useMemo(() => {
    let width;
    let height;

    if (ratio) {
      ([width, height] = ratio);
    } else {
      ({ width, height } = resolutions[resolutions.length - 1]);
    }

    const divisor = gcd(width, height);

    return {
      aspectRatio: `${width / divisor} / ${height / divisor}`,
      paddingHackRatio: `${((height / width) * 100).toFixed(3)}%`,
    };
  }, [ratio, resolutions]);

  if (unwrapped) {
    if (!(src && !parentRendersPlaceholder)) return null;

    return (
      <ImageInner
        ref={imgRef}
        src={sources.main}
        className={classNames(classNameImg)}
        style={{
          aspectRatio,
          ...(isInView && sources.preview && {
            backgroundImage: `url(${sources.preview})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }),
        }}
        alt={alt}
        lazy={lazy}
        onLoad={handleOnLoad}
        onError={handleOnError}
      />
    );
  }

  const containerStyle = styles.container(backgroundColor, paddingHackRatio);

  return (
    <div className={classNames(containerStyle, className)}>
      {src && !parentRendersPlaceholder && (
      <ImageInner
        ref={imgRef}
        src={sources.main}
        className={classNames(classNameImg)}
        style={{
          aspectRatio,
          ...(isInView && sources.preview && {
            backgroundImage: `url(${sources.preview})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }),
        }}
        alt={alt}
        lazy={lazy}
        onLoad={handleOnLoad}
        onError={handleOnError}
      />
      )}
    </div>
  );
};

Image.propTypes = {
  /**
   * Optional alt text for the image.
   */
  alt: PropTypes.string,
  /**
   * The background color of the image container
   */
  backgroundColor: PropTypes.string,
  /**
   * External class name for the image container.
   */
  className: PropTypes.string,
  /**
   * External class name for the image.
   */
  classNameImg: PropTypes.string,
  /**
   * When set to `true` the component will not render an image. The idea is that a parent component
   * renders a placeholder instead.
   */
  forcePlaceholder: PropTypes.bool,
  /**
   * Callback that is invoked when the image with the highest resolution has been loaded.
   */
  highestResolutionLoaded: PropTypes.func,
  /**
   * Whether the image should be lazy loaded.
   */
  lazy: PropTypes.bool,
  /**
   * Callback that is invoked when image loading failed
   */
  onError: PropTypes.func,
  /**
   * Callback that is invoked when the image has been loaded.
   */
  onLoad: PropTypes.func,
  /**
   * Ratio of the image. If not set, the ratio is calculated from the highest resolution.
   * @example [16, 9]
   */
  ratio: PropTypes.arrayOf(PropTypes.number),
  /**
   * Array with multiple resolutions for the image. The last resolution is the highest.
   * The component will try to load the second last resolution first and then the last resolution
   * as an attempt to display an image as soon as possible.
   */
  resolutions: PropTypes.arrayOf(PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  })),
  /**
   * Image source.
   * If it's a Shopgate internal URL it will be transformed to a full URL with dimensions from
   * the resolutions array.
   */
  src: PropTypes.string,
  /**
   * Whether the component is only supposed to render a plain img tag without any container.
   */
  unwrapped: PropTypes.bool,
};

const defaultResolutions = [
  {
    width: 440,
    height: 440,
  },
];

Image.defaultProps = {
  alt: null,
  backgroundColor: themeColors.placeholder,
  className: '',
  classNameImg: '',
  forcePlaceholder: false,
  highestResolutionLoaded: noop,
  onError: noop,
  onLoad: noop,
  ratio: null,
  resolutions: defaultResolutions,
  src: null,
  unwrapped: false,
  lazy: true,
};

export default memo(Image);
