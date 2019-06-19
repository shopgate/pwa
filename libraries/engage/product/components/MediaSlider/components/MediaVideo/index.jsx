import React from 'react';
import PropTypes from 'prop-types';
import { IntersectionVisibility, VideoPlayer } from '../../../../../components';
import { useWidgetSettings } from '../../../../../core';
import connect from './connector';
import { full } from '../../style';

/**
 * The media video component.
 * @returns {JSX}
 */
const MediaVideo = ({ connectivityType, media }) => {
  const settings = useWidgetSettings('@shopgate/engage/product/MediaSlider');

  const autoPlay = settings.videos.autoPlay[connectivityType] || false;

  return (
    <IntersectionVisibility>
      {({ visible, ratio, setRef }) => (
        <div ref={setRef} className={full}>
          <VideoPlayer
            url={media.url}
            playing={autoPlay && visible && ratio > 0.8}
            width="100%"
            height="100%"
            controls={settings.videos.controls}
            muted={settings.videos.muted}
            loop={settings.videos.loop}
          />
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
