import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { useReduceMotion } from '@shopgate/engage/a11y/hooks';
import {
  usePrevious,
  useAppEventOnReturnFromBackground,
} from '@shopgate/engage/core/hooks';
import { ConditionalWrapper } from '@shopgate/engage/components';
import Link from '@shopgate/pwa-common/components/Link';
import { IS_PAGE_PREVIEW_ACTIVE } from '@shopgate/engage/page/constants';
import { useVideoWidget } from './hooks';
import { isHttpsUrl } from '../../helpers';

const useStyles = makeStyles()((_theme, { borderRadius }) => ({
  root: {
    width: '100%',
    display: 'flex',
    overflow: 'hidden',
    borderRadius,
  },
  video: {
    // Add additional pixels to the width to prevent visible horizontal hairlines on some browsers
    width: 'calc(100% + 4px)',
  },
}));

/**
 * The VideoWidget is used to display a video.
 * @returns {JSX.Element}
 */
const Video = () => {
  const {
    url, muted, loop, controls, autoplay, borderRadius, link,
  } = useVideoWidget();

  const { classes } = useStyles({ borderRadius });
  const reduceMotion = useReduceMotion();
  const [hasError, setHasError] = useState(false);
  const videoRef = React.useRef(null);
  const prevUrl = usePrevious(url);
  const isValidUrl = useMemo(() => (url ? isHttpsUrl(url) : false), [url]);

  // Resume video playback when app returned from background
  useAppEventOnReturnFromBackground(() => {
    if (!videoRef.current || reduceMotion || !autoplay) {
      return;
    }

    videoRef.current.play();
  });

  useEffect(() => {
    if (!videoRef.current || reduceMotion) {
      return;
    }

    if (autoplay) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [autoplay, reduceMotion]);

  useEffect(() => {
    if (!url || url !== prevUrl) {
      setHasError(false);
    }
  }, [hasError, prevUrl, url]);

  if (!url || hasError || !isValidUrl) return null;

  return (
    <div className={classes.root}>
      <ConditionalWrapper
        condition={!!link && !controls && !IS_PAGE_PREVIEW_ACTIVE}
        wrapper={children =>
          <Link href={link}>
            { children }
          </Link>
        }
      >
        <video
          ref={videoRef}
        // Set play position to 0.001s to guarantee that there is always a frame shown
          src={`${url}#t=0.001`}
          muted={muted}
          controls={(!autoplay || reduceMotion) ? true : controls}
          autoPlay={reduceMotion ? false : autoplay}
          className={classes.video}
          preload="auto"
          playsInline
          loop={loop}
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

export default Video;
