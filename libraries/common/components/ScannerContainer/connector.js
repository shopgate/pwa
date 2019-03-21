import { connect } from 'react-redux';
import { hasScannerSupport } from '@shopgate/pwa-common/selectors/client';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  hasScannerSupport: hasScannerSupport(state),
});

export default connect(mapStateToProps);
