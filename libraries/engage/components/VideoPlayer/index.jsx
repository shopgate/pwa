import React, { PureComponent } from 'react';
import ReactPlayer from 'react-player';
import { UIEvents } from '@shopgate/pwa-core';
import { UI_VISIBILITY_CHANGE } from '@shopgate/pwa-common/constants/ui';

/**
 * Video player component
 * @param {Object} props props
 * @returns {JSX}
 */
class VideoPlayer extends PureComponent {
  static propTypes = ReactPlayer.propTypes

  static defaultProps = ReactPlayer.defaultProps

  state = {
    ready: false,
    playing: this.props.playing,
    userPaused: false,
  }

  /**
   * @inheritDoc
   */
  componentDidMount() {
    UIEvents.addListener(UI_VISIBILITY_CHANGE, this.handleVisibilityChange);
  }

  /**
   * @inheritDoc
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    const nextState = { playing: nextProps.playing };
    if (this.props.url !== nextProps.url) {
      nextState.ready = false;
    }
    this.setState(nextState);
  }

  /**
   * @inheritDoc
   */
  componentWillUnmount() {
    UIEvents.removeListener(UI_VISIBILITY_CHANGE, this.handleVisibilityChange);
  }

  /** @returns {boolean} */
  getPlayingState = () => (
    (this.state.ready && !this.state.userPaused) && this.state.playing
  )

  /** @returns {void} */
  handleReady = () => {
    this.setState({ ready: true });
  }

  /**
   * Not allowed autoplay error (User gesture permission)
   * @param {Object} error error
   */
  handleError = (error) => {
    if (error && error.name === 'NotAllowedError') {
      this.setState({ playing: false });
    }
  }

  /** @returns {undefined} */
  handlePause = () => {
    // Check if was not paused programmatically
    if (this.state.playing) {
      this.setState({
        userPaused: true,
        playing: false,
      });
    }
  }

  /** @returns {undefined} */
  handlePlay = () => {
    if (!this.state.playing) {
      this.setState({
        userPaused: false,
        playing: true,
      });
    }
  }

  /** @returns {undefined} */
  handleVisibilityChange = () => {
    this.setState({ playing: false });
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <ReactPlayer
        playsinline
        {...this.props}
        playing={this.getPlayingState()}
        onReady={this.handleReady}
        onPause={this.handlePause}
        onPlay={this.handlePlay}
        onError={this.handleError}
      />
    );
  }
}

export default VideoPlayer;
