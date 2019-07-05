import { connect } from 'react-redux';
import { getCurrentBaseProduct, getProductMedia } from '@shopgate/engage/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The current component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => {
  const media = getProductMedia(state, props);
  return ({
    hasMedia: !!media && !!media.length,
    product: getCurrentBaseProduct(state, props),
  });
};

export default connect(mapStateToProps);
