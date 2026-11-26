import { makeStyles } from '@shopgate/engage/styles';
import { IntersectionVisibility, VideoPlayer } from '@shopgate/engage/components';
import { useAppSelector, useWidgetSettings } from '@shopgate/engage/core/hooks';
import { getClientConnectivityType } from '@shopgate/pwa-common/selectors/client';

export interface MediaVideoProps {
  media: {
    url: string;
  };
}

interface MediaSliderSettings {
  videos: {
    /** Whether videos play automatically, per connectivity type. */
    autoPlay: Record<string, boolean>;
    controls: boolean;
    muted: boolean;
    loop: boolean;
  };
}

interface VisibilityState {
  visible: boolean;
  ratio: number;
  setRef: (element: HTMLElement | null) => void;
}

const useStyles = makeStyles()({
  videoWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    paddingTop: '22%',
  },
  videoResponsive: {
    position: 'relative',
    overflow: 'hidden',
    paddingTop: '56.25%',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

/**
 * A video of the product media slider. It plays automatically when configured for the current
 * connection and mostly visible.
 * @returns The video.
 */
const MediaVideo = ({ media }: MediaVideoProps) => {
  const { classes } = useStyles();
  const connectivityType: string = useAppSelector(getClientConnectivityType);
  const { videos } = useWidgetSettings('@shopgate/engage/product/MediaSlider') as MediaSliderSettings;
  const autoPlay = videos.autoPlay[connectivityType] || false;

  return (
    <IntersectionVisibility>
      {(visibility: VisibilityState) => (
        <div ref={visibility.setRef} className={classes.videoWrapper}>
          <div className={classes.videoResponsive}>
            <VideoPlayer
              url={media.url}
              playing={autoPlay && visibility.visible && visibility.ratio > 0.8}
              width="100%"
              height="100%"
              controls={videos.controls}
              muted={videos.muted}
              loop={videos.loop}
              className={classes.video}
            />
          </div>
        </div>
      )}
    </IntersectionVisibility>
  );
};

export default MediaVideo;
