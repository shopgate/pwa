import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { useVideoWidget } from './hooks';

const useStyles = makeStyles()(() => ({
  video: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));
/**
 * The VideoWidget is used to display a video.
 * @returns {JSX.Element}
 */
const Video = () => {
  const { classes } = useStyles();
  const {
    url, muted, loop, controls, autoplay,
  } = useVideoWidget();

  if (!url) return null;

  return (
    <video
      src={url}
      muted={muted}
      controls={controls}
      autoPlay={autoplay}
      className={classes.video}
      preload="auto"
      playsInline
      loop={loop}
      aria-hidden
    >
      <track kind="captions" src="" srcLang="de" label="Deutsch" />
    </video>
  );
};

export default Video;
