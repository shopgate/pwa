import { connect } from 'react-redux';
import { ACTION_REPLACE } from '@virtuous/conductor/constants';
import { navigate } from '@shopgate/pwa-common/action-creators/router';
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
  navigate: productId => dispatch(navigate(ACTION_REPLACE, `${ITEM_PATH}/${bin2hex(productId)}`)),
});

export default connect(mapStateToProps, mapDispatchToProps);
