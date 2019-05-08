import React, { lazy } from 'react';
import PropTypes from 'prop-types';
const ReactPlayer = lazy(() => import('react-player'));

/**
 * Handles
 */
const VideoPlayer = (props) => (
  <ReactPlayer {...props} />
);

VideoPlayer.propTypes = ReactPlayer.propTypes;
VideoPlayer.defaultProps = ReactPlayer.defaultProps;

export default VideoPlayer;
