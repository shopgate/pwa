import React, { useEffect, useState } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { useReduceMotion } from '@shopgate/engage/a11y/hooks';
import { usePrevious } from '@shopgate/engage/core';
import { useVideoWidget } from './hooks';

const useStyles = makeStyles()((theme, { borderRadius }) => ({
  video: {
    width: '100%',
    borderRadius,
  },
}));
/**
 * The VideoWidget is used to display a video.
 * @returns {JSX.Element}
 */
const Video = () => {
  const {
    url, muted, loop, controls, autoplay, borderRadius,
  } = useVideoWidget();

  const { classes } = useStyles({ borderRadius });
  const reduceMotion = useReduceMotion();
  const [hasError, setHasError] = useState(false);
  const videoRef = React.useRef(null);
  const prevAutoPlay = usePrevious(autoplay);
  const prevUrl = usePrevious(url);

  useEffect(() => {
    if (videoRef.current && prevAutoPlay && !autoplay) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    if (videoRef.current && !prevAutoPlay && autoplay) {
      videoRef.current.play();
    }

    if (!url || url !== prevUrl || !hasError) {
      setHasError(false);
    }
  }, [autoplay, hasError, prevAutoPlay, prevUrl, url]);

  if (!url || hasError) return null;

  return (
    <video
      ref={videoRef}
      src={url}
      muted={muted}
      controls={controls}
      autoPlay={reduceMotion ? false : autoplay}
      className={classes.video}
      preload="auto"
      playsInline
      loop={loop}
      aria-hidden
      onError={() => setHasError(true)}
    >
      {/* for a11y reasons there needs to be a track file (but video is aria hidden) */}
      <track kind="captions" src="" srcLang="de" label="Deutsch" />
    </video>
  );
};

export default Video;
