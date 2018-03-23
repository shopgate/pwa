import { connect } from 'react-redux';
import getComponents from './helpers/getComponents';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  components: getComponents(props.name, props.props),
});

export default connect(mapStateToProps);
