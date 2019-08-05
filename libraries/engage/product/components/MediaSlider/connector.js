import { connect } from 'react-redux';
import {
  makeGetProductMedia,
  makeGetProductFeaturedMedia,
  ITEM_PATH,
  MEDIA_TYPE_IMAGE,
  MEDIA_TYPE_VIDEO,
} from '@shopgate/engage/product';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getProductMedia = makeGetProductMedia();
  const getProductFeaturedMedia = makeGetProductFeaturedMedia();
  const types = [MEDIA_TYPE_VIDEO, MEDIA_TYPE_IMAGE];

  return (state, props) => ({
    media: getProductMedia(state, {
      ...props,
      types: props.types || types,
    }),
    featuredMedia: getProductFeaturedMedia(state, props),
  });
};

/**
* Connects the dispatch function to a callable function in the props.
* @param {Function} dispatch The redux dispatch function.
* @param {Object} props The component props.
* @return {Object} The extended component props.
*/
const mapDispatchToProps = (dispatch, props) => ({
  navigate: currentSlide =>
    dispatch(historyPush({
      pathname: `${ITEM_PATH}/${bin2hex(props.productId)}/gallery/${currentSlide}`,
    })),
});

export default connect(makeMapStateToProps, mapDispatchToProps);
