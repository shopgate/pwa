import { connect } from 'react-redux';
import { makeGetCharacteristicFeaturedImage } from '@shopgate/engage/product';

/**
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object}
 */
function mapStateToProps(state, props) {
  const getCharacteristicFeaturedImage = makeGetCharacteristicFeaturedImage();

  return ({
    imageUrl: getCharacteristicFeaturedImage(state, props),
  });
}

export default connect(mapStateToProps);
