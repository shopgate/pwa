import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { useReduceMotion } from '@shopgate/engage/a11y/hooks';
import {
  usePrevious,
  useAppEventOnReturnFromBackground,
} from '@shopgate/engage/core/hooks';
import { ConditionalWrapper, Link } from '@shopgate/engage/components';
import PropTypes from 'prop-types';
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
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerLinkContainer: {
    overflow: 'hidden',
    width: '100%',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

/**
 * The VideoWidget is used to display a video.
 * @param {Object} props The component props.
 * @param {boolean} props.isBanner Whether the video is used in a banner.
 * @returns {JSX.Element}
 */
const Video = ({ isBanner }) => {
  const {
    url, muted, loop, controls, autoplay, borderRadius, link,
  } = useVideoWidget();

  const { classes, cx } = useStyles({ borderRadius });
  const reduceMotion = useReduceMotion();
  const [hasError, setHasError] = useState(false);
  const videoRef = React.useRef(null);
  const prevUrl = usePrevious(url);
  const isValidUrl = useMemo(() => (url ? isHttpsUrl(url) : false), [url]);

  const showControls = useMemo(() => {
    if (link) {
      // When a link is set we never show controls to avoid side effects due to two clickable areas.
      return false;
    }

    return (!autoplay || reduceMotion) ? true : controls;
  }, [autoplay, controls, link, reduceMotion]);

  // Resume video playback when app returned from background
  useAppEventOnReturnFromBackground(() => {
    if (!videoRef.current || reduceMotion || !autoplay) {
      return;
    }

    videoRef.current.play();
  });

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    if (reduceMotion) {
      // Pause playback when reduced motion settings changed after video was rendered
      videoRef.current.pause();
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

  let autoPlayValue = false;
  if (!reduceMotion) {
    autoPlayValue = isBanner ? true : autoplay;
  }

  return (
    <div className={cx({
      [classes.root]: !isBanner,
      [classes.bannerContainer]: isBanner && !link,
      [classes.bannerLinkContainer]: isBanner && link,
    })}
    >
      <ConditionalWrapper
        condition={!!link}
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
          muted={isBanner ? true : muted}
          controls={isBanner ? false : showControls}
          autoPlay={reduceMotion ? false : autoPlayValue}
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

Video.propTypes = {
  isBanner: PropTypes.bool,
};

Video.defaultProps = {
  isBanner: false,
};

export default Video;
