import React, { Fragment, PureComponent } from 'react';
import { logger } from '@shopgate/pwa-core/helpers';
import {
  SCANNER_SCOPE_DEFAULT,
  SCANNER_TYPE_BARCODE,
} from '@shopgate/pwa-core/constants/Scanner';
import { RouteContext } from '@shopgate/pwa-common/context';
import ScannerContainer from '@shopgate/pwa-ui-shared/ScannerContainer';
import ScannerOverlay from '@shopgate/pwa-ui-shared/ScannerOverlay';
import View from 'Components/View';
import { DefaultBar } from 'Components/AppBar/presets';
import colors from 'Styles/colors';

const bodyElement = window.document.getElementsByTagName('body')[0];
const htmlElement = bodyElement.parentElement;

/**
 * // TODO SCANNER: Implement correct top bar
 * @returns {JSX}
 */
const TopBar = () => (
  <DefaultBar title="titles.scanner" />
);

/**
 * The scanner page component.
 */
class ScannerView extends PureComponent {
  removeBackground = () => {
    // Make background transparent, so the scanner becomes visible.
    logger.log('ScannerView::componentDidMount: Setting background transparent');
    htmlElement.style.setProperty('background-color', colors.transparent);
    bodyElement.style.setProperty('background-color', colors.transparent);
  }

  resetBackground = () => {
    // Remove background transparency because the scanner is not visible anymore.
    logger.log('ScannerView::handleScannerDidDisappear: Removing transparency from background');
    htmlElement.style.removeProperty('background-color');
    bodyElement.style.removeProperty('background-color');
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <View background={colors.transparent}>
        <RouteContext.Consumer>
          {({ params: { scope = SCANNER_SCOPE_DEFAULT, type = SCANNER_TYPE_BARCODE } = {} }) => (
            <Fragment>
              <TopBar />
              <ScannerContainer
                scope={scope}
                type={type}
                removeBackground={this.removeBackground}
                resetBackground={this.resetBackground}
              >
                <ScannerOverlay />
              </ScannerContainer>
            </Fragment>
          )}
        </RouteContext.Consumer>
      </View>
    );
  }
}

export default ScannerView;
