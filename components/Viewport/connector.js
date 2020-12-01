import { connect } from 'react-redux';
import { getEnableWebIndexing } from '@shopgate/engage/core';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  enableWebIndexing: getEnableWebIndexing(state),
});

export default connect(mapStateToProps);
