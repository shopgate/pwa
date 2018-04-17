import { connect } from 'react-redux';
import { getTitle } from 'Components/View/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  action: state.history.action,
  title: getTitle(state),
});

export default connect(mapStateToProps);
