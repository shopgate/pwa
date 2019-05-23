import { connect } from 'react-redux';
import { getCurrentProductStock, AVAILABILITY_STATE_OK } from '@shopgate/engage/product';

/**
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => {
  const stock = getCurrentProductStock(state, props);
  if (!stock) {
    return {
      availability: null,
    };
  }
  return {
    /* Show stock info always as availability on PDP */
    availability: {
      text: stock.info,
      state: AVAILABILITY_STATE_OK,
    },
  };
};

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @return {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!prev.availability && next.availability) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
