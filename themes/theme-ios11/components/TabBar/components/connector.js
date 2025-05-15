import { connect } from 'react-redux';
import { navigate } from './actions';

/**
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = {
  historyPush: navigate,
};

export default connect(null, mapDispatchToProps);

