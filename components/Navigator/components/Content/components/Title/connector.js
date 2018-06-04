import { connect } from 'react-redux';
import { getTitle } from '@shopgate/pwa-common/selectors/ui';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  title: getTitle(state),
});

export default connect(mapStateToProps);
