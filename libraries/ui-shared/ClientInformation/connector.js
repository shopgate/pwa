import { connect } from 'react-redux';
import { getClientInformation } from '@shopgate/pwa-common/selectors/client';
import { enableDebugLogging } from './actions';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state) => {
  const clientInformation = getClientInformation(state);

  return {
    appVersion: clientInformation.appVersion,
    codebaseVersion: clientInformation.codebaseVersion,
    deviceId: clientInformation.deviceId,
    libVersion: clientInformation.libVersion,
  };
};

/**
 * Only update when the codebaseVersion changed.
 * @param {Object} next The next state.
 * @param {Object} prev the previous state.
 * @returns {boolean}
 */
const areStatesEqual = (next, prev) => {
  const prevClient = getClientInformation(prev);
  const nextClient = getClientInformation(next);

  return prevClient.codebaseVersion === nextClient.codebaseVersion;
};

const mapDispatchToProps = {
  enableDebugLogging,
};

export default connect(mapStateToProps, mapDispatchToProps, null, { areStatesEqual });
