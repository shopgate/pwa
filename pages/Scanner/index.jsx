import React, { Fragment, PureComponent } from 'react';
import {
  SCANNER_SCOPE_DEFAULT,
  SCANNER_TYPE_BARCODE,
} from '@shopgate/pwa-core/constants/Scanner';
import { RouteContext } from '@shopgate/pwa-common/context';
import ScannerContainer from '@shopgate/pwa-ui-shared/ScannerContainer';
import ScannerOverlay from '@shopgate/pwa-ui-shared/ScannerOverlay';
import View from 'Components/View';
import { BackBar } from 'Components/AppBar/presets';

const backgroundColor = 'transparent';

/**
 * The scanner page component.
 */
class ScannerView extends PureComponent {
  /**
   * @param {string} color The new background color.
   */
  updateBackground = (color) => {
    document.querySelectorAll('html, body').forEach((el) => {
      el.style.setProperty('background-color', color);
    });
  }

  removeBackground = () => {
    // Make background transparent, so the scanner becomes visible.
    this.updateBackground(backgroundColor);
  }

  resetBackground = () => {
    // Remove background transparency because the scanner is not visible anymore.
    this.updateBackground();
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <View background={backgroundColor}>
        <RouteContext.Consumer>
          {({ query: { scope = SCANNER_SCOPE_DEFAULT, type = SCANNER_TYPE_BARCODE } = {} }) => (
            <Fragment>
              <BackBar title="titles.scanner" right={null} />
              <ScannerContainer
                scope={scope}
                type={type}
                scannerDidOpen={this.removeBackground}
                scannerDidClose={this.resetBackground}
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
