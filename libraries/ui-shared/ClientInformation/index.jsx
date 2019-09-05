import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from './connector';
import styles from './style';

const TIMEOUT_SHOW_DEVICE_ID = 5000;

/**
 * Client information component which is shown as the footer of the navigation drawer.
 */
class ClientInformation extends Component {
  static propTypes = {
    enableDebugLogging: PropTypes.func.isRequired,
    appVersion: PropTypes.string,
    codebaseVersion: PropTypes.string,
    deviceId: PropTypes.string,
    libVersion: PropTypes.string,
  };

  static defaultProps = {
    appVersion: null,
    codebaseVersion: null,
    deviceId: null,
    libVersion: null,
  };

  /**
   * The component constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      isDeviceIdVisible: false,
    };
  }

  /**
   * Setup event listener.
   */
  componentDidMount() {
    document.addEventListener('touchend', this.cancelTimer);
  }

  /**
   * @param {Object} nextProps the next component props.
   * @param {Object} nextState the next component state.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.codebaseVersion !== nextProps.codebaseVersion ||
      this.state.isDeviceIdVisible !== nextState.isDeviceIdVisible
    );
  }

  /**
   * Remove event listener.
   */
  componentWillUnmount() {
    document.removeEventListener('touchend', this.cancelTimer);
  }

  /**
   * Starts the timer.
   */
  startTimer = () => {
    this.timer = setTimeout(this.showDeviceId, TIMEOUT_SHOW_DEVICE_ID);
  };

  showDeviceId = () => {
    if (!this.state.isDeviceIdVisible) {
      this.setState({ isDeviceIdVisible: true });
      this.props.enableDebugLogging();
    }
  }

  /**
   * Cancels the timer.
   */
  cancelTimer = () => {
    clearTimeout(this.timer);
  };

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    if (this.props.codebaseVersion === null) {
      return null;
    }

    const { isDeviceIdVisible } = this.state;
    const {
      appVersion, libVersion, deviceId, codebaseVersion,
    } = this.props;

    return (
      <div className={styles.wrapper} onTouchStart={this.startTimer}>
        <p className={styles.unselectable}>
          App Version:
          {' '}
          {appVersion}
          {' '}
(
          {codebaseVersion}
)
          <br />
          Lib Version:
          {' '}
          {libVersion}
        </p>
        {isDeviceIdVisible &&
          <p className={styles.deviceId}>
            Device ID:
            {' '}
            {deviceId}
          </p>
        }
      </div>
    );
  }
}

export default connect(ClientInformation);

// For testing.
export { ClientInformation as Unwrapped };
