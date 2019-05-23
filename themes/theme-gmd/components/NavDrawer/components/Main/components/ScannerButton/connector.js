import { connect } from 'react-redux';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { hasScannerSupport } from '@shopgate/engage/core';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  hasScannerSupport: !appConfig.hasNoScanner && hasScannerSupport(state),
});

export default connect(mapStateToProps);
