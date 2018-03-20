import { connect } from 'react-redux';
import openFilterView from '../../actions/openFilterView';

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @param {Object} props The components props.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = (dispatch, props) => ({
  handleOpenFilters: () => dispatch(openFilterView(props)),
});

export default connect(null, mapDispatchToProps);
