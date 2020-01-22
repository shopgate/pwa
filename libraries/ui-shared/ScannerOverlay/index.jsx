import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import AppScanner from '@shopgate/pwa-core/classes/Scanner';
import CameraOverlay from './components/CameraOverlay';
import ScannerBar from './components/ScannerBar';

/**
 * The scanner overlay component.
 */
class ScannerOverlay extends PureComponent {
  static propTypes = {
    flashlight: PropTypes.bool,
  }

  static defaultProps = {
    flashlight: false,
  }

  /**
   * Initializes the component.
   * @param {Object} props The components props.
   */
  constructor(props) {
    super(props);

    this.state = {
      flashlight: props.flashlight,
    };
  }

  /**
   * @param {Object} nextProps New props to apply.
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.flashlight !== nextProps.flashlight) {
      this.setState({ flashlight: nextProps.flashlight });
    }
  }

  handleToggleFlashlight = () => {
    this.setState({ flashlight: AppScanner.toggleFlashlight() });
  }

  /**
   * Render the camera overlay and the bottom bar with its contents.
   * @returns {JSX}
   */
  render() {
    return (
      <Fragment>
        <CameraOverlay />
        <ScannerBar
          flashlightState={this.state.flashlight}
          onToggleFlashlight={this.handleToggleFlashlight}
        />
      </Fragment>
    );
  }
}

export default ScannerOverlay;
