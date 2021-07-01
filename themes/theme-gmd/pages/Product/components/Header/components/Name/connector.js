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

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @return {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!prev.name && next.name) {
    return false;
  }
  if (!prev.longName && next.longName) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
