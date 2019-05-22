import { connect } from 'react-redux';
import { getProductMedia, MEDIA_TYPE_IMAGE } from '@shopgate/engage/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  media: getProductMedia(state, {
    ...props,
    types: [MEDIA_TYPE_IMAGE],
  }) || [],
});

export default connect(mapStateToProps);
