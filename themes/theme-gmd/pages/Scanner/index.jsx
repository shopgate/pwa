import React, { PureComponent } from 'react';
// . import PropTypes from 'prop-types';
import registerEvents from '@shopgate/pwa-core/commands/registerEvents';
import appEvent from '@shopgate/pwa-core/classes/Event';
import AppScanner, {
  APP_EVENT_SCANNER_DID_APPEAR,
  APP_EVENT_SCANNER_DID_DISAPPEAR,
} from '@shopgate/pwa-core/classes/Scanner';
import ScannerEventListener from '@shopgate/pwa-core/classes/ScannerEventListener';
import {
  SCANNER_SCOPE_DEFAULT_BARCODE,
  SCANNER_TYPE_BARCODE,
} from '@shopgate/pwa-core/constants/Scanner';
import { RouteContext } from '@shopgate/pwa-common/context';
import View from 'Components/View';
import colors from 'Styles/colors';
import { DefaultBar } from 'Components/AppBar/presets';
import connect from './connector';

const bodyElement = window.document.getElementsByTagName('body')[0];
const htmlElement = bodyElement.parentElement;

/**
 * The scanner page component.
 */
class Scanner extends PureComponent {
  static propTypes = {
    // . navigateBack: PropTypes.func.isRequired,
    // . setLoading: PropTypes.func.isRequired,
  }

  /**
   * Initializes the component.
   * @param {Object} props The components props.
   */
  constructor(props) {
    super(props);
    this.state = {
      errMsg: '',
      scanPayload: {
        format: '',
        code: '',
      },
    };
  }

  /**
   * Starts up the app scanner.
   */
  async componentDidMount() {
    try {
      await AppScanner.open(SCANNER_SCOPE_DEFAULT_BARCODE, SCANNER_TYPE_BARCODE, this.handleClose);

      // Make background transparent, so the scanner becomes visible.
      htmlElement.style.setProperty('background-color', colors.transparent);
      bodyElement.style.setProperty('background-color', colors.transparent);

      registerEvents([APP_EVENT_SCANNER_DID_APPEAR]);
      registerEvents([APP_EVENT_SCANNER_DID_DISAPPEAR]);
      appEvent.addCallback(APP_EVENT_SCANNER_DID_DISAPPEAR, this.handleScannerDidDisappear);

      // TODO: REVOME THE DEMO LISTENER
      AppScanner.addListener(new ScannerEventListener(
        'DemoListener',
        SCANNER_SCOPE_DEFAULT_BARCODE,
        SCANNER_TYPE_BARCODE
      ).setHandler(this.handleScanDemo));
    } catch (error) {
      // TODO: Display error message? Just close scanner page?
      // . this.setState({ errMsg: error.message });
    }
  }

  /**
   * Shut down the app scanner.
   */
  componentWillUnmount() {
    // First close
    Scanner.close();

    // Unsubscribe from the app event to avoid messing with possible other Scanner view components.
    appEvent.removeCallback(APP_EVENT_SCANNER_DID_DISAPPEAR, this.handleScannerDidDisappear);
  }

  handleScannerDidDisappear = () => {
    // Remove background transparency because the scanner is not visible anymore.
    htmlElement.style.removeProperty('background-color');
    bodyElement.style.removeProperty('background-color');
  }

  /**
   * TODO: REMOVE THIS DEMO HANDLER
   * @param {ScannerEvent} event The event triggered by the Scanner.
   */
  handleScanDemo = (event) => {
    this.setState({ scanPayload: event.payload });
  }

  /**
   * @param {Scanner} scanner The scanner that requested closing.
   */
  handleClose = (scanner) => {
    // Do not close scanner here, but when the scanner page is closed instead.
    scanner.close();

    // . scanner.start(); // TODO: REMOVE THIS! The restart is only there for demo purposes
  }

  handleClick = () => {
    AppScanner.toggleFlashlight();
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <View background={colors.transparent}>
        <RouteContext.Consumer>
          {({ visible }) => visible &&
            <React.Fragment >
              <DefaultBar title="titles.scanner" />
              <div>{this.state.errMsg}</div>
              {/* <div onClick={this.handleClick}>Click me to enable flashlight</div> */}
              <div>Format: {this.state.scanPayload.format}</div>
              <div>Code: {this.state.scanPayload.code}</div>
            </React.Fragment>
          }
        </RouteContext.Consumer>
      </View>
    );
  }
}

export default connect(Scanner);
