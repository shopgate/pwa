/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
    client: PropTypes.shape({
      isFetching: PropTypes.bool,
      appVersion: PropTypes.string,
      libVersion: PropTypes.string,
      codebaseVersion: PropTypes.string,
      deviceId: PropTypes.string,
    }).isRequired,
    enableDebugLogging: PropTypes.func.isRequired,
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
    // Only if isFetching is exactly false then there's data to show.
    if (this.props.client.isFetching !== false) {
      return null;
    }

    const { isDeviceIdVisible } = this.state;
    const { appVersion, libVersion, deviceId, codebaseVersion } = this.props.client;

    return (
      <div className={styles.wrapper} onTouchStart={this.startTimer}>
        <p className={styles.unselectable}>
          App Version: {appVersion} ({codebaseVersion})<br />
          Lib Version: {libVersion}
        </p>
        {isDeviceIdVisible &&
          <p className={styles.deviceId}>
            Device ID: {deviceId}
          </p>
        }
      </div>
    );
  }
}

export default connect(ClientInformation);

// For testing.
export { ClientInformation as Unwrapped };
