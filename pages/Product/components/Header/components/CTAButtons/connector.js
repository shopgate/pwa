import { connect } from 'react-redux';
import { isCurrentProductOnFavoriteList } from '@shopgate/pwa-common-commerce/favorites/selectors';
import { makeIsProductActive, makeIsBaseProductActive } from '@shopgate/engage/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const makeMapStateToProps = () => {
  const isProductActive = makeIsProductActive();
  const isBaseProductActive = makeIsBaseProductActive();

  return (state, props) => ({
    isFavorite: isCurrentProductOnFavoriteList(state, props),
    isProductActive: isProductActive(state, props) && isBaseProductActive(state, props),
  });
};

export default connect(makeMapStateToProps);
