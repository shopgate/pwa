import { connect } from 'react-redux';
import removeToast from '../../actions/toast/removeToast';
import { getToast, hasNextToast, isDismissed } from '../../selectors/toast';
import unblockToast from '../../action-creators/toast/unblockToast';

/**
 * Maps state to props.
 * @param {Object} state State.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  dismissed: isDismissed(state),
  toast: getToast(state),
  hasNextToast: hasNextToast(state),
});

/**
 * Maps dispatch to props.
 * @param {function} dispatch Dispatch.
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  removeToast: (id) => {
    dispatch(removeToast(id));
  },
  unblockToast: () => dispatch(unblockToast()),
  // Used for dispatching prepared action stored in a toast message.
  dispatchAction: action => dispatch(action),
});

export default connect(mapStateToProps, mapDispatchToProps);
