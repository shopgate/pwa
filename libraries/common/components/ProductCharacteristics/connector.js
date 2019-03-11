import { connect } from 'react-redux';
import { router } from '@shopgate/pwa-common/helpers/router';
import isEqual from 'lodash/isEqual';
import { getProductVariants } from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  variants: getProductVariants(state, props),
});

/**
 * @return {Object}
 */
const mapDispatchToProps = () => ({
  navigate: (productId) => {
    const route = router.getCurrentRoute();
    router.update(route.id, { productId });
  },
});

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if ((!prev.variants && next.variants) || !isEqual(prev.variants, next.variants)) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, mapDispatchToProps, null, { areStatePropsEqual });
