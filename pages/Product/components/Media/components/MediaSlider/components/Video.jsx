import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import VideoPlayer from '@shopgate/engage/components/VideoPlayer';
import IntersectionVisibility from '@shopgate/pwa-common/components/IntersectionVisibility';

/**
 * The product media video slide component.
 */
class Video extends Component {
  static propTypes = {
    media: PropTypes.shape({
      code: PropTypes.string,
      url: PropTypes.string,
    }).isRequired,
  };

  /**
   * @param {Object} nextProps the next props
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props.media, nextProps.media);
  }

  /**
   * Renders the product media slider component.
   * @returns {JSX}
   */
  render() {
    const { media } = this.props;

    return (
      <IntersectionVisibility>
        {({ ratio }) => (
          <VideoPlayer
            url={media.url}
            playing={ratio > 0.7}
            width='100%'
            height='100%'
          />
        )}
      </IntersectionVisibility>
    );
  }
}

export default Video;
