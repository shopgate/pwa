import { connect } from 'react-redux';
import { makeGetProductMedia, MEDIA_TYPE_IMAGE } from '@shopgate/engage/product';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getProductMedia = makeGetProductMedia();
  const types = [MEDIA_TYPE_IMAGE];
  return (state, props) => ({
    media: getProductMedia(state, {
      ...props,
      types: props.types || types,
    }) || [],
  });
};

export default connect(makeMapStateToProps);
