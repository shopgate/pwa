import {
  useEffect, useMemo, useState, useRef, type ComponentType, type ReactNode,
} from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { useReduceMotion } from '@shopgate/engage/a11y/hooks';
import {
  usePrevious,
  useAppEventOnReturnFromBackground,
} from '@shopgate/engage/core/hooks';
import { ConditionalWrapper, Link as EngageLink } from '@shopgate/engage/components';
import { isHttpsUrl } from '../../helpers';

// `Link` is a redux-connected component whose react-redux connect() typing resolves its own props
// (href/children) to `never`; alias it to its actual usable prop shape.
const Link = EngageLink as unknown as ComponentType<{
  href?: string | null;
  children?: ReactNode;
}>;

/**
 * Style parameters for the widget video.
 */
interface WidgetVideoStyleParams {
  borderRadius?: number | string;
}

const useStyles = makeStyles<WidgetVideoStyleParams>()((_theme, { borderRadius }) => ({
  root: {
    width: '100%',
    display: 'flex',
    overflow: 'hidden',
    borderRadius,
  },
  video: {
    // Add additional pixels to the width to prevent visible horizontal hairlines on some browsers
    width: 'calc(100% + 3px)',
    display: 'flex',
  },
  banner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  bannerContainer: {
    position: 'absolute',
    height: '100%',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

/**
 * Props of the {@link WidgetVideo} component.
 */
export interface WidgetVideoProps {
  /**
   * Whether the video is used in a banner.
   */
  isBanner?: boolean;
  /**
   * The video URL.
   */
  url?: string | null;
  /**
   * Whether the video is muted.
   */
  muted?: boolean;
  /**
   * Whether the video is looping.
   */
  loop?: boolean;
  /**
   * Whether the video controls are shown.
   */
  controls?: boolean;
  /**
   * Whether the video should autoplay.
   */
  autoplay?: boolean;
  /**
   * The border radius value.
   */
  borderRadius?: number | string;
  /**
   * The link URL.
   */
  link?: string | null;
}

/**
 * The WidgetVideo component is used to display a video in a widget.
 */
const WidgetVideo = ({
  isBanner = false,
  url = null,
  muted = false,
  loop = false,
  controls = false,
  autoplay = false,
  borderRadius = 0,
  link = null,
}: WidgetVideoProps) => {
  const reduceMotion = useReduceMotion();
  const autoplayValue = reduceMotion ? false : isBanner || autoplay;

  const { classes, cx } = useStyles({ borderRadius });
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevUrl = usePrevious(url);
  const isValidUrl = useMemo(() => (url ? isHttpsUrl(url) : false), [url]);

  const showControls = useMemo(() => {
    if (link || isBanner) {
      // When a link is set we never show controls to avoid side effects due to two clickable areas.
      return false;
    }

    return (!autoplayValue || reduceMotion) ? true : controls;
  }, [autoplayValue, controls, isBanner, link, reduceMotion]);

  // Resume video playback when app returned from background
  useAppEventOnReturnFromBackground(() => {
    const video = videoRef.current;
    if (!video || reduceMotion || !autoplayValue) {
      return;
    }

    video.play();
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (reduceMotion) {
      // Pause playback when reduced motion settings changed after video was rendered
      video.pause();
      return;
    }

    if (autoplayValue) {
      video.play();
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [autoplayValue, reduceMotion]);

  useEffect(() => {
    if (!url || url !== prevUrl) {
      setHasError(false);
    }
  }, [hasError, prevUrl, url]);

  if (!url || hasError || !isValidUrl) return null;

  return (
    <div className={cx(classes.root, { [classes.bannerContainer]: isBanner })}>
      <ConditionalWrapper
        condition={!!link}
        wrapper={(children: ReactNode) =>
          <Link href={link}>
            { children }
          </Link>}
      >
        <video
          ref={videoRef}
          // Set play position to 0.001s to guarantee that there is always a frame shown
          src={`${url}#t=0.001`}
          muted={isBanner ? true : muted}
          controls={showControls}
          autoPlay={autoplayValue}
          className={cx(classes.video, { [classes.banner]: isBanner })}
          preload="auto"
          playsInline
          loop={isBanner ? true : loop}
          aria-hidden
          onError={() => { setHasError(true); }}
        >
          {/* for a11y reasons there needs to be a track file (but video is aria hidden) */}
          <track kind="captions" src="" srcLang="de" label="Deutsch" />
        </video>
      </ConditionalWrapper>
    </div>
  );
};

export default WidgetVideo;
