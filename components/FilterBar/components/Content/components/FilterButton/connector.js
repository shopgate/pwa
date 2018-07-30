import { connect } from 'react-redux';
import openFilterView from '../../actions/openFilterView';

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = (dispatch) => ({
  handleOpenFilters: () => dispatch(openFilterView()),
});

export default connect(null, mapDispatchToProps);
