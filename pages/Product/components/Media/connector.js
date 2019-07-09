import { connect } from 'react-redux';
import { makeGetCharacteristicFeaturedImage } from '@shopgate/engage/product';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  const getCharacteristicFeaturedImage = makeGetCharacteristicFeaturedImage();

  /**
  * @param {Object} state The application state.
  * @param {Object} props The component props.
  * @returns {Object}
  */
  return (state, props) => ({
    imageUrl: getCharacteristicFeaturedImage(state, props),
  });
}

export default connect(makeMapStateToProps);
