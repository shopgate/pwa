import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { IntersectionVisibility, VideoPlayer } from '../../../../../components';
import { useWidgetSettings } from '../../../../../core';
import connect from './connector';

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
 * The media video component.
 * @returns {JSX}
 */
const MediaVideo = ({ connectivityType, media }) => {
  const { classes } = useStyles();
  const settings = useWidgetSettings('@shopgate/engage/product/MediaSlider');

  const autoPlay = settings.videos.autoPlay[connectivityType] || false;

  return (
    <IntersectionVisibility>
      {({ visible, ratio, setRef }) => (
        <div ref={setRef} className={classes.videoWrapper}>
          <div className={classes.videoResponsive}>
            <VideoPlayer
              url={media.url}
              playing={autoPlay && visible && ratio > 0.8}
              width="100%"
              height="100%"
              controls={settings.videos.controls}
              muted={settings.videos.muted}
              loop={settings.videos.loop}
              className={classes.video}
            />
          </div>
        </div>
      )}
    </IntersectionVisibility>
  );
};

MediaVideo.propTypes = {
  connectivityType: PropTypes.string.isRequired,
  media: PropTypes.shape({
    code: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
};

export default connect(MediaVideo);
