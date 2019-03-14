import { connect } from 'react-redux';

/**
 * @param {Object} state state
 * @return {{isFirstAddress: boolean, isBusy: boolean, config: UserConfig}}
 */
const mapStateToProps = state => ({
  state,
});

/**
 * @param {Function} dispatch dispatch
 * @return {{triggerError: Function}}
 */
const mapDispatchToProps = dispatch => ({
  triggerError: error => dispatch(alert(error)),
});

export default connect(mapStateToProps, mapDispatchToProps);
