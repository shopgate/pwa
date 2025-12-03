import React from 'react';
import { useVideoWidget } from './hooks';
import WidgetVideo from '../../components/WidgetVideo';

/**
 * The VideoWidget is used to display a video.
 * @returns {JSX.Element}
 */
const Video = () => {
  const {
    url, muted, loop, controls, autoplay, borderRadius, link,
  } = useVideoWidget();

  return (
    <WidgetVideo
      url={url}
      loop={loop}
      muted={muted}
      controls={controls}
      autoplay={autoplay}
      borderRadius={borderRadius}
      link={link}
    />
  );
};

export default Video;
