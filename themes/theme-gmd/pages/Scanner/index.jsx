import React, { Fragment, PureComponent } from 'react';
import { logger } from '@shopgate/pwa-core/helpers';
import AppScanner from '@shopgate/pwa-core/classes/Scanner';
import ScannerEventListener from '@shopgate/pwa-core/classes/ScannerEventListener';
import {
  SCANNER_SCOPE_DEFAULT_BARCODE,
  SCANNER_TYPE_BARCODE,
} from '@shopgate/pwa-core/constants/Scanner';
import { RouteContext } from '@shopgate/pwa-common/context';
import ScannerContainer from '@shopgate/pwa-ui-shared/ScannerContainer';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';

import View from 'Components/View';
import { DefaultBar } from 'Components/AppBar/presets';
import colors from 'Styles/colors';

const bodyElement = window.document.getElementsByTagName('body')[0];
const htmlElement = bodyElement.parentElement;

/**
 * The scanner page component.
 */
class ScannerView extends PureComponent {
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

    // TODO: REMOVE THE DEMO LISTENER
    new ScannerEventListener('DemoListener', SCANNER_SCOPE_DEFAULT_BARCODE, SCANNER_TYPE_BARCODE)
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

  handleToggleFlashlightClick = () => {
    this.setState({ flashlight: AppScanner.toggleFlashlight() });
  }

  /**
   * TODO: REMOVE THIS DEMO HANDLER
   * @param {ScannerEvent} event The event triggered by the Scanner.
   */
  handleScanDemo = (event) => {
    this.setState({ scanPayload: event.payload });
    AppScanner.start();
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <View background={colors.transparent}>
        <RouteContext.Consumer>
          {({
            visible,
            params: { scope = SCANNER_SCOPE_DEFAULT_BARCODE, type = SCANNER_TYPE_BARCODE } = {},
            params, /* TODO: REMOVE THIS */
          }) => visible &&
            <Fragment>
              <DefaultBar title="titles.scanner" />
              <div>Flashlight is: {this.state.flashlight ? 'On' : 'Off'}</div>
              <div>{JSON.stringify(params /* TODO: REMOVE THIS */)}</div>

              <ScannerContainer
                scope={scope}
                type={type}
                removeBackground={this.removeBackground}
                resetBackground={this.resetBackground}
              >
                <RippleButton onClick={this.handleToggleFlashlightClick}>
                  Click me to enable flashlight
                </RippleButton>
                <div>Format: {this.state.scanPayload.format}</div>
                <div>Code: {this.state.scanPayload.code}</div>
              </ScannerContainer>
            </Fragment>
          }
        </RouteContext.Consumer>
      </View>
    );
  }
}

export default ScannerView;
