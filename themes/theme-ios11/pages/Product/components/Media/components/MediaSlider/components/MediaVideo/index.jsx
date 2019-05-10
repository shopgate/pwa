import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import VideoPlayer from '@shopgate/engage/components/VideoPlayer';
import IntersectionVisibility from '@shopgate/pwa-common/components/IntersectionVisibility';
import config from './config';
import connect from './connector';
import styles from '../style';

/**
 * The product media video slide component.
 */
class MediaVideo extends Component {
  static propTypes = {
    autoPlay: PropTypes.bool.isRequired,
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
    const { media, autoPlay } = this.props;

    return (
      <IntersectionVisibility>
        {({ visible, ratio, setRef }) => (
          <div ref={setRef} className={styles.full}>
            <VideoPlayer
              url={media.url}
              playing={autoPlay && visible && ratio > 0.8}
              width="100%"
              height="auto"
              controls={config.controls}
              muted={config.muted}
              loop={config.loop}
            />
          </div>
        )}
      </IntersectionVisibility>
    );
  }
}

export default connect(MediaVideo);
