import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { logger } from '@shopgate/pwa-core/helpers';
import AppScanner from '@shopgate/pwa-core/classes/Scanner';
import connect from './connector';

/**
 * Wraps the Scanner overlay with functionality to automatically open and close the scanner,
 * as well as triggering the removal and reset of the background.
 */
class ScannerContainer extends PureComponent {
  static propTypes = {
    hasScannerSupport: PropTypes.bool.isRequired,
    removeBackground: PropTypes.func.isRequired,
    resetBackground: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    children: PropTypes.node,
    onError: PropTypes.func,
  }

  static defaultProps = {
    children: null,
    onError: () => {},
  }

  /**
   * Starts up the app scanner.
   */
  async componentDidMount() {
    // Avoid trying to open the scanner if the app does not support it.
    if (!this.props.hasScannerSupport) {
      return;
    }

    try {
      logger.log('ScannerContainer::componentDidMount: Opening Scanner');
      await AppScanner.open(this.props.scope, this.props.type);

      // Make background transparent, so the scanner becomes visible.
      logger.log('ScannerContainer::componentDidMount: Removing the background');
      this.props.removeBackground();
    } catch (error) {
      this.props.onError(error);
    }
  }

  /**
   * Shut down the app scanner.
   */
  componentWillUnmount() {
    // Don't do anything if the scanner is not supported.
    if (!this.props.hasScannerSupport) {
      return;
    }

    logger.log('ScannerContainer::componentWillUnmount: Resetting the background');
    this.props.resetBackground();

    logger.log('ScannerContainer::componentWillUnmount: Closing Scanner');
    AppScanner.close();
  }

  /**
   * Does not render anythingwhen the app does not support the scanner.
   * @returns {JSX}
   */
  render() {
    return (
      <Fragment>
        {this.props.hasScannerSupport && this.props.children}
      </Fragment>
    );
  }
}

export default connect(ScannerContainer);
