import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import type { ReactPlayerProps } from 'react-player';
import { UIEvents } from '@shopgate/engage/core/events';
import { UI_VISIBILITY_CHANGE } from '@shopgate/pwa-common/constants/ui';

/**
 * Plays a video of any url that react-player supports. A video the user paused stays paused when
 * `playing` changes, and every video pauses when the app goes to the background.
 * @returns The player.
 */
const VideoPlayer = ({ url, playing: playingProp = false, ...props }: ReactPlayerProps) => {
  const [playing, setPlaying] = useState(playingProp);
  const [ready, setReady] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    setPlaying(playingProp);
  }, [playingProp]);

  useEffect(() => {
    setReady(false);
  }, [url]);

  useEffect(() => {
    /** Pauses the video. */
    const pause = () => setPlaying(false);

    UIEvents.addListener(UI_VISIBILITY_CHANGE, pause);

    return () => {
      UIEvents.removeListener(UI_VISIBILITY_CHANGE, pause);
    };
  }, []);

  return (
    <ReactPlayer
      playsinline
      {...props}
      url={url}
      playing={ready && !userPaused && playing}
      onReady={() => setReady(true)}
      onPlay={() => {
        setUserPaused(false);
        setPlaying(true);
      }}
      onPause={() => {
        if (playing) {
          setUserPaused(true);
          setPlaying(false);
        }
      }}
      onError={(error) => {
        if (error?.name === 'NotAllowedError') {
          setPlaying(false);
        }
      }}
    />
  );
};

export default VideoPlayer;
