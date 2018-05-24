import { connect } from 'react-redux';
import { getCurrentPageId } from './selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  configs: state.page,
  pageId: getCurrentPageId(state),
});

export default connect(mapStateToProps);
