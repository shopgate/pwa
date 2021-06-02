import { connect } from 'react-redux';
import { getProductLongName } from '@shopgate/engage/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  title: getProductLongName(state, props),
});

export default connect(mapStateToProps);
