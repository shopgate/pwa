import React, {
  useMemo, useState, useEffect, useRef, useCallback,
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
 * The image component.
 * @param {Object} props The components props.
 * @returns {JSX.Element}
 */
const Image = ({
  alt,
  animating,
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

  const [currentSrc, setCurrentSrc] = useState(sources.preview || sources.main);
  const [initialImageCached, setInitialImageCached] = useState(!animating);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);

  // Effect to determine if the initial image is cached. Info is used to configure fade-in
  // animation. When image doesn't need to be fetched from the server, it will be instantly
  // displayed and fade-in is not needed.
  useEffect(() => {
    if (!animating) return;
    const img = new window.Image();
    img.src = sources.preview || sources.main;
    const { complete } = img;
    img.src = '';
    setInitialImageCached(complete);
  }, [animating, sources.main, sources.preview]);

  // Effect to create an Intersection Observer to enable lazy loading
  useEffect(() => {
    if (!lazy) return undefined;

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
  }, [lazy]);

  // Effect to load the large image when the Image component reaches the viewport
  useEffect(() => {
    // Only load the large image if we are in the viewport and the current source is the preview
    if (!isInView || currentSrc === sources.main) return;

    // Create a new "virtual" image element to trigger fetching of the large image
    const img = new window.Image();
    img.src = sources.main;
    // Set the source as current source for the actual image element when loading process
    // finished or failed. Callback props will be invoked by the handlers of the img tag.
    img.onload = () => {
      setCurrentSrc(sources.main);
    };
    img.onerror = () => {
      setCurrentSrc(sources.main);
    };
  }, [currentSrc, isInView, sources.main]);

  const imageRatio = useMemo(() => {
    if (ratio) {
      const [x, y] = ratio;

      return ((y / x) * 100).toFixed(3);
    }

    const { width, height } = resolutions[resolutions.length - 1];

    return ((height / width) * 100).toFixed(3);
  }, [ratio, resolutions]);

  /**
   * Handles the onLoad event of the image.
   */
  const handleOnLoad = useCallback((e) => {
    // Only invoke callbacks from props when the img tag shows the main image
    if (currentSrc === sources.main) {
      highestResolutionLoaded();
      onLoad(e);
    }
    setImageLoaded(true);
  }, [currentSrc, highestResolutionLoaded, onLoad, sources.main]);

  /**
   * Handles the onError event of the image.
   */
  const handleOnError = useCallback((e) => {
    // Only invoke callbacks from props when the img tag shows the main image
    if (currentSrc === sources.main) {
      onError(e);
    }
  }, [currentSrc, onError, sources.main]);

  if (unwrapped) {
    if (!(src && !parentRendersPlaceholder)) return null;

    return (
      <ImageInner
        ref={imgRef}
        src={currentSrc}
        className={classNames(classNameImg, {
          [styles.imageAnimated]: animating && !initialImageCached,
          [styles.imageVisible]: animating && (initialImageCached || imageLoaded),
        })}
        alt={alt}
        lazy={lazy}
        onLoad={handleOnLoad}
        onError={handleOnError}
      />
    );
  }

  const containerStyle = styles.container(backgroundColor, `${imageRatio}%`);

  return (
    <div className={classNames(containerStyle, className)}>
      {src && !parentRendersPlaceholder && (
        <ImageInner
          ref={imgRef}
          src={currentSrc}
          className={classNames(classNameImg, {
            [styles.imageAnimated]: animating && !initialImageCached,
            [styles.imageVisible]: animating && (initialImageCached || imageLoaded),
          })}
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
   * Whether the image should animate with a fade-in effect when loaded.
   */
  animating: PropTypes.bool,
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

Image.defaultProps = {
  alt: null,
  animating: false,
  backgroundColor: themeColors.placeholder,
  className: '',
  classNameImg: '',
  forcePlaceholder: false,
  highestResolutionLoaded: noop,
  onError: noop,
  onLoad: noop,
  ratio: null,
  resolutions: [
    {
      width: 440,
      height: 440,
    },
  ],
  src: null,
  unwrapped: false,
  lazy: true,
};

export default Image;
