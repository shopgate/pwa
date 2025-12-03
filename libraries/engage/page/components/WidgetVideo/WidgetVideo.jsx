import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { useReduceMotion } from '@shopgate/engage/a11y/hooks';
import {
  usePrevious,
  useAppEventOnReturnFromBackground,
} from '@shopgate/engage/core/hooks';
import { ConditionalWrapper, Link } from '@shopgate/engage/components';
import PropTypes from 'prop-types';
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
    position: 'absolute',
    height: '100%',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

/**
 * The WidgetVideo component is used to display a video in a widget.
 * @param {Object} props The component props.
 * @param {boolean} props.isBanner Whether the video is used in a banner.
 * @param {string} props.url The video URL.
 * @param {boolean} props.muted Whether the video is muted.
 * @param {boolean} props.loop Whether the video is looping.
 * @param {boolean} props.controls Whether the video controls are shown.
 * @param {boolean} props.autoplay Whether the video should autoplay.
 * @param {number} props.borderRadius The border radius value.
 * @param {string} props.link The link URL.
 * @returns {JSX.Element}
 */
const WidgetVideo = ({
  isBanner,
  url,
  muted,
  loop,
  controls,
  autoplay,
  borderRadius,
  link,
}) => {
  const reduceMotion = useReduceMotion();
  let autoPlayValue = true;
  if (reduceMotion) {
    autoPlayValue = false;
  }
  if (!reduceMotion) {
    autoPlayValue = isBanner ? true : autoplay;
  }

  const { classes, cx } = useStyles({ borderRadius });
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
    if (!videoRef.current || reduceMotion || !autoPlayValue) {
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

    if (autoPlayValue) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [autoPlayValue, reduceMotion]);

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
          autoPlay={autoPlayValue}
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

WidgetVideo.propTypes = {
  autoplay: PropTypes.bool,
  borderRadius: PropTypes.string,
  controls: PropTypes.bool,
  isBanner: PropTypes.bool,
  link: PropTypes.string,
  loop: PropTypes.bool,
  muted: PropTypes.bool,
  url: PropTypes.string,
};

WidgetVideo.defaultProps = {
  isBanner: false,
  link: null,
  url: null,
  muted: false,
  loop: false,
  controls: false,
  autoplay: false,
  borderRadius: 0,
};

export default WidgetVideo;
