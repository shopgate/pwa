import { connect } from 'react-redux';
import closeModal from '../../actions/modal/closeModal';
import { getFirstModal } from '../../selectors/modal';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  modal: getFirstModal(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  confirm: id => dispatch(closeModal(id, true)),
  dismiss: id => dispatch(closeModal(id, false)),
});

export default connect(mapStateToProps, mapDispatchToProps);
