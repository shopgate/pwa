import { connect } from 'react-redux';
import { getProductOptions } from '@shopgate/pwa-common-commerce/product/selectors/options';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The current component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  options: getProductOptions(state, props),
});

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The current component props.
 * @return {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!prev.options && next.options) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
