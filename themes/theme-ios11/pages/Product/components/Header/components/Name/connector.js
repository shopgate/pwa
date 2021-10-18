import { connect } from 'react-redux';
import { getProductName, getProductLongName } from '@shopgate/engage/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  name: getProductName(state, props),
  longName: getProductLongName(state, props),
});

export default connect(mapStateToProps);
