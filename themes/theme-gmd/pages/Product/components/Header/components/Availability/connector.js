import { connect } from 'react-redux';
import { getCurrentProductStock } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { AVAILABILITY_STATE_OK } from '@shopgate/pwa-common-commerce/product/constants';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state) => {
  const stock = getCurrentProductStock(state);
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

export default connect(mapStateToProps);
