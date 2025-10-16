import React, { useEffect, useState } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { useReduceMotion } from '@shopgate/engage/a11y/hooks';
import { useVideoWidget } from './hooks';
import { usePrevious } from '../../../core';

const useStyles = makeStyles()(() => ({
  video: {
    maxWidth: '100%',
  },
  videoLoading: {
    width: '100%',
  },
}));
/**
 * The VideoWidget is used to display a video.
 * @returns {JSX.Element}
 */
const Video = () => {
  const { classes } = useStyles();
  const reduceMotion = useReduceMotion();
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = React.useRef(null);

  const {
    url, muted, loop, controls, autoplay,
  } = useVideoWidget();

  const prevAutoPlay = usePrevious(autoplay);
  useEffect(() => {
    if (videoRef.current && prevAutoPlay && !autoplay) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    if (videoRef.current && !prevAutoPlay && autoplay) {
      videoRef.current.play();
    }

    if (!url) {
      setIsLoaded(false);
    }
  }, [autoplay, prevAutoPlay, url]);

  if (!url) return null;

  return (
    <video
      ref={videoRef}
      src={url}
      muted={muted}
      controls={controls}
      autoPlay={reduceMotion ? false : autoplay}
      className={isLoaded ? classes.video : classes.videoLoading}
      preload="auto"
      playsInline
      loop={loop}
      aria-hidden
      onLoadedData={() => setIsLoaded(true)}
    >
      {/* for a11y reasons there needs to be a track file (but video is aria hidden) */}
      <track kind="captions" src="" srcLang="de" label="Deutsch" />
    </video>
  );
};

export default Video;
