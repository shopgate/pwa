import { connect } from 'react-redux';
import { historyReplace } from '@shopgate/pwa-common/actions/router';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
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
 * @param {Function} dispatch  The redux dispatch function.
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  navigate: (productId, isVariant) => dispatch(historyReplace({
    pathname: `${ITEM_PATH}/${bin2hex(productId)}`,
    state: {
      isVariant,
    },
  })),
});

export default connect(mapStateToProps, mapDispatchToProps);
