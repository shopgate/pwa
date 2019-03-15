import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { logger } from '@shopgate/pwa-core/helpers';
import { isVersionAtLeast } from '@shopgate/pwa-core/helpers/version';
import AppScanner, { SCANNER_MIN_APP_LIB_VERSION } from '@shopgate/pwa-core/classes/Scanner';
import ScannerEventListener from '@shopgate/pwa-core/classes/ScannerEventListener';
import {
  SCANNER_SCOPE_DEFAULT,
  SCANNER_TYPE_BARCODE,
} from '@shopgate/pwa-core/constants/Scanner';
import { RouteContext } from '@shopgate/pwa-common/context';
import ScannerContainer from '@shopgate/pwa-ui-shared/ScannerContainer';
import clientConnect from '@shopgate/pwa-ui-shared/ClientInformation/connector';
// TODO SCANNER: use correct on icon (create new from svg)
// . import FlashOnIcon from '@shopgate/pwa-ui-shared/icons/FlashOnIcon';
// TODO SCANNER: use correct off icon (create new from svg)
// . import FlashOffIcon from '@shopgate/pwa-ui-shared/icons/FlashOffIcon';
// TODO SCANNER: add new import with correct "corner" icons (create new from svg)
// . import TopLeftCornerIcon from '@shopgate/pwa-ui-shared/icons/TopLeftCornerIcon';

import View from 'Components/View';
import { DefaultBar } from 'Components/AppBar/presets';
import colors from 'Styles/colors';

const bodyElement = window.document.getElementsByTagName('body')[0];
const htmlElement = bodyElement.parentElement;

/**
 * @returns {JSX}
 */
const TopBar = () => (
  <DefaultBar title="titles.scanner" />
);

/**
 * @param {Object} scanPayload The payload from the app scanner when it scanned something.
 * @returns {JSX}
 */
const CameraOverlay = ({ scanPayload }) => (
  <Fragment>
    <div>Format: {scanPayload.format}</div>
    <div>Code: {scanPayload.code}</div>
  </Fragment>
);
CameraOverlay.propTypes = {
  scanPayload: PropTypes.shape({
    format: PropTypes.string,
    code: PropTypes.string,
  }).isRequired,
};

// TODO SCANNER: add locales for the bottom bar
// TODO SCANNER: get all new locales translated
/**
 * @param {boolean} flashlightState The on/off state of the flashlight.
 * @param {Function} onToggleFlashlight The toggle event triggered by the user.
 * @returns {JSX}
 * @constructor
 */
const BottomBar = ({ flashlightState, onToggleFlashlight }) => (
  <Fragment>
    <button onClick={onToggleFlashlight}>Flashlight is: {flashlightState ? 'On' : 'Off'}</button>
  </Fragment>
);
BottomBar.propTypes = {
  flashlightState: PropTypes.bool.isRequired,
  onToggleFlashlight: PropTypes.func.isRequired,
};

/**
 * The scanner page component.
 */
class ScannerView extends PureComponent {
  static propTypes = {
    libVersion: PropTypes.string,
  };

  static defaultProps = {
    libVersion: '1.0',
  }

  /**
   * Initializes the component.
   * @param {Object} props The components props.
   */
  constructor(props) {
    super(props);
    this.state = {
      flashlight: false,
      scanPayload: {
        format: '',
        code: '',
      },
    };

    // TODO SCANNER: REMOVE THE DEMO LISTENER
    new ScannerEventListener('DemoListener', SCANNER_SCOPE_DEFAULT, SCANNER_TYPE_BARCODE)
      .setHandler(this.handleScanDemo).attach();
  }

  removeBackground = () => {
    // Make background transparent, so the scanner becomes visible.
    logger.log('Scanner::componentDidMount: Setting background transparent');
    htmlElement.style.setProperty('background-color', colors.transparent);
    bodyElement.style.setProperty('background-color', colors.transparent);
  }

  resetBackground = () => {
    // Remove background transparency because the scanner is not visible anymore.
    logger.log('Scanner::handleScannerDidDisappear: Removing transparency from background');
    htmlElement.style.removeProperty('background-color');
    bodyElement.style.removeProperty('background-color');
  }

  handleToggleFlashlight = () => {
    this.setState({ flashlight: AppScanner.toggleFlashlight() });
  }

  // TODO SCANNER: REMOVE THIS DEMO HANDLER
  /**
   * @param {ScannerEvent} event The event triggered by the Scanner.
   */
  handleScanDemo = (event) => {
    this.setState({ scanPayload: event.payload });
    AppScanner.start();
  }

  /**
   * Does not render any contents when the libVersion is too low.
   * @returns {JSX}
   */
  render() {
    return (
      <View background={colors.transparent}>
        <RouteContext.Consumer>
          {({
            visible,
            params: { scope = SCANNER_SCOPE_DEFAULT, type = SCANNER_TYPE_BARCODE } = {},
          }) => visible && isVersionAtLeast(SCANNER_MIN_APP_LIB_VERSION, this.props.libVersion) &&
            <ScannerContainer
              scope={scope}
              type={type}
              removeBackground={this.removeBackground}
              resetBackground={this.resetBackground}
            >
              <TopBar />
              <CameraOverlay scanPayload={this.state.scanPayload} />
              <BottomBar
                flashlightState={this.state.flashlight}
                onToggleFlashlight={this.handleToggleFlashlight}
              />
            </ScannerContainer>
          }
        </RouteContext.Consumer>
      </View>
    );
  }
}

export default clientConnect(ScannerView);
