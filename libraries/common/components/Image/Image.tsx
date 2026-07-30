import {
  useMemo, useState, useEffect, useRef, useCallback, memo,
} from 'react';
import type { CSSProperties, SyntheticEvent } from 'react';
import noop from 'lodash/noop';
import { makeStyles } from '@shopgate/engage/styles';
import { getFullImageSource } from '@shopgate/engage/core/helpers';
import { useImageServiceSettings } from '@shopgate/engage/settings/hooks';
import type { ImageResolution } from '@shopgate/engage/settings/types/appSettings';
import ImageInner from './ImageInner';

export interface ImageProps {
  /**
   * Optional alt text for the image. Without one the image is marked decorative.
   */
  alt?: string | null;
  /**
   * The background color of the image container.
   */
  backgroundColor?: string;
  /**
   * External class name for the image container.
   */
  className?: string | null;
  /**
   * External class name for the image itself.
   */
  classNameImg?: string | null;
  /**
   * When set to `true` the component will not render an image. The idea is that a parent component
   * renders a placeholder instead.
   */
  forcePlaceholder?: boolean;
  /**
   * Callback that is invoked when the image with the highest resolution has been loaded.
   */
  highestResolutionLoaded?: () => void;
  /**
   * Microdata property name, e.g. "image" for a schema.org Product. Emitted as the itemprop
   * attribute so crawlers can pick the image out of the surrounding item.
   */
  itemProp?: string;
  /**
   * Whether the image should be lazy loaded.
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
   * Width and height parts of the rendered aspect ratio, e.g. [16, 9]. Without one the ratio is
   * calculated from the highest resolution.
   */
  ratio?: number[] | null;
  /**
   * The resolutions to request, ordered ascending. The last is displayed; the second to last is
   * loaded first as a preview, so something appears as soon as possible.
   */
  resolutions?: ImageResolution[];
  /**
   * Image source. A Shopgate internal url is transformed into a full url carrying the dimensions
   * from the resolutions array.
   */
  src?: string | null;
  /**
   * Whether to render a plain img tag without any container.
   */
  unwrapped?: boolean;
}

const useStyles = makeStyles<{ background?: string, paddingTop: string }>()((
  _theme,
  { background, paddingTop }
) => ({
  container: {
    background,
    position: 'relative',
    zIndex: 0,
    ':before': {
      display: 'block',
      content: '""',
      width: '100%',
      paddingTop,
    },
  },
}));

/**
 * Calculates the Greatest Common Divisor of two numbers using the Euclidean algorithm.
 * @param a The first number.
 * @param b The second number.
 * @returns The greatest common divisor, or 1 when the pair cannot be reduced.
 */
const gcd = (a: number, b: number): number => {
  // Anything but a pair of positive whole numbers is left unreduced. The values can originate from
  // an admin field a merchant is still typing into, and NaN or Infinity would otherwise recurse
  // until the stack overflows, while a fraction would reduce to a near-zero divisor.
  if (!Number.isInteger(a) || !Number.isInteger(b) || a <= 0 || b <= 0) {
    return 1;
  }

  let dividend = a;
  let remainder = b;

  while (remainder !== 0) {
    const next = dividend % remainder;

    dividend = remainder;
    remainder = next;
  }

  return dividend;
};

/**
 * Whether a value can be used as one side of an aspect ratio.
 * @param value The value to check.
 * @returns Whether it is a usable length.
 */
const isUsableLength = (value: number): boolean => Number.isFinite(value) && value > 0;

const defaultResolutions: ImageResolution[] = [
  {
    width: 440,
    height: 440,
  },
];

/**
 * The image component.
 * @param props The components props.
 * @returns The rendered component.
 */
const Image = (props: ImageProps) => {
  const {
    alt = null,
    backgroundColor = 'var(--sg-palette-background-emphasized)',
    className = '',
    classNameImg = '',
    forcePlaceholder: parentRendersPlaceholder = false,
    highestResolutionLoaded = noop,
    itemProp,
    onError = noop,
    onLoad = noop,
    ratio = null,
    resolutions = defaultResolutions,
    src = null,
    lazy = true,
    unwrapped = false,
  } = props;

  // Quality and fill color are configured app wide, so they are resolved here rather than passed
  // in by every caller. The returned object is reference stable, so it does not defeat the memo.
  const imageServiceSettings = useImageServiceSettings();

  // Prepare two image sources - a small preview image and a large main image. The idea is to
  // display an image as soon as possible. Small images might be also available in the cache from
  // the previous page.
  const sources = useMemo(
    () => {
      // Create a preview source when resolutions array has more than one element
      const preview = resolutions.length > 1
        ? getFullImageSource(src, resolutions[resolutions.length - 2], imageServiceSettings)
        : null;

      // Create a main source when resolutions array has at least one element (highest resolution)
      const main = resolutions.length > 0
        ? getFullImageSource(src, resolutions[resolutions.length - 1], imageServiceSettings)
        : null;

      return ({
        // Only assign preview source if it is different from the main source. Image swap logic
        // will not run when no preview source is available.
        preview: preview !== main ? preview : null,
        main,
      });
    },
    [resolutions, src, imageServiceSettings]
  );

  const imgRef = useRef<HTMLImageElement>(null);
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
   * @param event The load event.
   */
  const handleOnLoad = useCallback((event: SyntheticEvent<HTMLImageElement>) => {
    highestResolutionLoaded();
    onLoad(event);
  }, [highestResolutionLoaded, onLoad]);

  /**
   * Handles the onError event of the image.
   * @param event The error event.
   */
  const handleOnError = useCallback((event: SyntheticEvent<HTMLImageElement>) => {
    onError(event);
  }, [onError]);

  /**
   * Memoized calculation of aspect ratio and CSS padding-hack ratio for responsive elements.
   *
   * aspectRatio is the ratio in the format `width / height` (e.g. `16 / 9`), paddingHackRatio the
   * same as a percentage for older browsers (e.g. `56.250%` for a 16:9 ratio).
   */
  const {
    aspectRatio,
    paddingHackRatio,
  } = useMemo(() => {
    const [width, height] = ratio ?? [
      resolutions[resolutions.length - 1]?.width,
      resolutions[resolutions.length - 1]?.height,
    ];

    // Fall back to a square rather than emitting "NaN / NaN" or dividing by zero. Reached when the
    // resolutions are empty, or when a ratio arrives half typed from the admin.
    if (!isUsableLength(width) || !isUsableLength(height)) {
      return {
        aspectRatio: '1 / 1',
        paddingHackRatio: '100.000%',
      };
    }

    const divisor = gcd(width, height);

    return {
      aspectRatio: `${width / divisor} / ${height / divisor}`,
      paddingHackRatio: `${((height / width) * 100).toFixed(3)}%`,
    };
  }, [ratio, resolutions]);

  const { classes, cx } = useStyles({
    background: backgroundColor,
    paddingTop: paddingHackRatio,
  });

  const innerStyle: CSSProperties = {
    aspectRatio,
    ...(isInView && sources.preview && {
      backgroundImage: `url(${sources.preview})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }),
  };

  if (unwrapped) {
    if (!(src && !parentRendersPlaceholder)) return null;

    return (
      <ImageInner
        ref={imgRef}
        src={sources.main}
        className={cx(classNameImg)}
        style={innerStyle}
        alt={alt}
        itemProp={itemProp}
        lazy={lazy}
        onLoad={handleOnLoad}
        onError={handleOnError}
      />
    );
  }

  return (
    <div className={cx(classes.container, className, 'common__image__container')}>
      {src && !parentRendersPlaceholder && (
      <ImageInner
        ref={imgRef}
        src={sources.main}
        className={cx(classNameImg)}
        style={innerStyle}
        alt={alt}
        itemProp={itemProp}
        lazy={lazy}
        onLoad={handleOnLoad}
        onError={handleOnError}
      />
      )}
    </div>
  );
};

export default memo(Image);
