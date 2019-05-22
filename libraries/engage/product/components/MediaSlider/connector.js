import { connect } from 'react-redux';
import { getProductMedia, ITEM_PATH, MEDIA_TYPE_IMAGE, MEDIA_TYPE_VIDEO } from '@shopgate/engage/product';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The current component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  media: getProductMedia(state, {
    ...props,
    types: props.types || [MEDIA_TYPE_VIDEO, MEDIA_TYPE_IMAGE],
  }),
});

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

export default connect(mapStateToProps, mapDispatchToProps);
