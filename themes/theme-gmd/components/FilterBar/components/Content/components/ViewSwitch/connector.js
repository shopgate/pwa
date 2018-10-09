import { connect } from 'react-redux';
import { setCategoryViewMode } from './action-creators';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  viewMode: state.ui.categoryPage.viewMode,
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  toggleViewMode: viewMode => dispatch(setCategoryViewMode(viewMode)),
});

export default connect(mapStateToProps, mapDispatchToProps);
