import {
  useMemo, useState, useEffect, useRef, useCallback, memo,
} from 'react';
import type { CSSProperties, ReactElement, SyntheticEvent } from 'react';
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
   * Shows the `placeholder` even when the image could be loaded. For a parent that decides on
   * grounds this component cannot see, e.g. a product that is not orderable.
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
   * Whether the image is loaded only once it comes near the viewport. Turn it off for images that
   * are visible immediately, e.g. the first tile of a list.
   */
  lazy?: boolean;
  /**
   * Callback that is invoked when image loading failed. Handling the failure is not required - a
   * `placeholder` covers that - so this is for callers that need to react beyond the image itself.
   */
  onError?: (event: SyntheticEvent<HTMLImageElement>) => void;
  /**
   * Callback that is invoked when the image has been loaded.
   */
  onLoad?: (event: SyntheticEvent<HTMLImageElement>) => void;
  /**
   * Rendered in place of the image when there is no `src`, when `forcePlaceholder` is set, or when
   * the image failed to load. It renders inside the container, so it inherits the reserved aspect
   * ratio box and needs no sizing of its own.
   */
  placeholder?: ReactElement | null;
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
   * Image source. A url the image service serves is rewritten to carry the requested dimensions and
   * the app wide quality and fill settings. Any other url is used as it is, so `resolutions` and
   * `ratio` then only affect the layout, not what is downloaded.
   */
  src?: string | null;
  /**
   * Renders a plain img tag without the container, for callers that position the image themselves.
   * Nothing reserves its space while it loads, and `backgroundColor` has nothing to apply to.
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
 * Renders an image at the configured resolutions, inside a container that reserves its aspect ratio
 * so the layout does not shift while it loads.
 *
 * What a caller should know:
 *
 * - **Nothing is rendered until there is something to render.** Without a `src`, the container is
 *   still there and keeps its space, but it stays empty unless a `placeholder` is given.
 * - **A failed image is remembered per source, not per component.** Once a `placeholder` is given,
 *   it takes over on failure, and the image returns by itself as soon as the requested url changes -
 *   a new `src`, different `resolutions`, or an app wide image setting edited in the admin. Callers
 *   that pass no `placeholder` keep the failed image, and `onError` keeps reporting every attempt.
 * - **`onLoad` and `onError` are always forwarded**, whether or not a placeholder is involved.
 * - **`unwrapped` gives up the container**, and with it the reserved aspect ratio box and the
 *   background color. The caller has to provide the space itself.
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
    placeholder = null,
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
  const [failedSource, setFailedSource] = useState<string | null>(null);

  // A failure counts against the source that produced it, not against the component. Anything that
  // rebuilds the url - a new src, a reconfigured ratio, a different fill color - is by itself the
  // decision to try again, so the placeholder gives way without anyone having to reset a flag.
  //
  // Only callers that provide a placeholder have the image taken away from them. Without one there
  // is nothing to swap to, so a failed image stays mounted and keeps reporting through onError,
  // exactly as it behaved before this prop existed.
  //
  // The null check matters: an empty resolutions array leaves no source to request, and would
  // otherwise match the initial state and report a failure that never happened.
  const hasFailed = sources.main !== null && failedSource === sources.main;

  const showPlaceholder = !src || parentRendersPlaceholder || (!!placeholder && hasFailed);

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
    setFailedSource(sources.main);
    onError(event);
  }, [onError, sources.main]);

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
    if (showPlaceholder) return placeholder;

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
      {showPlaceholder ? placeholder : (
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
