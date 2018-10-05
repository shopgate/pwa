import { connect } from 'react-redux';
import { getSortOrder } from '@shopgate/pwa-common/selectors/history';
import changeSort from './actions/changeSort';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  sort: getSortOrder(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  changeSort: sortValue => dispatch(changeSort(sortValue)),
});

export default connect(mapStateToProps, mapDispatchToProps);
