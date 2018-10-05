import { connect } from 'react-redux';
import setProductOption from '@shopgate/pwa-common-commerce/product/action-creators/setProductOption';
import {
  getCurrentProductOptions,
  getProductOptions,
} from '@shopgate/pwa-common-commerce/product/selectors/options';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  currentOptions: getCurrentProductOptions(state),
  options: getProductOptions(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  setProductOption: (optionId, valueId) => dispatch(setProductOption(optionId, valueId)),
});

export default connect(mapStateToProps, mapDispatchToProps);
