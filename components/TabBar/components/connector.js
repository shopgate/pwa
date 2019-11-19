import { connect } from 'react-redux';
import { navigate } from './actions';

/**
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = {
  navigate,
};

export default connect(null, mapDispatchToProps);

