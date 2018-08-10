import { connect } from 'react-redux';
import { getHistoryPathname } from '../../selectors/history';

/**
 * Maps state to props.
 * @param {Object} state Current state.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  historyPath: getHistoryPathname(state),
});

export default connect(mapStateToProps);
