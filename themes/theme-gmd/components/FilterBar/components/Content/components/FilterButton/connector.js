import { connect } from 'react-redux';
import openFilterRoute from '../../actions/openFilterRoute';

/**
 * @return {Object}
 */
const mapDispatchToProps = {
  navigate: () => openFilterRoute(),
};

export default connect(null, mapDispatchToProps);
