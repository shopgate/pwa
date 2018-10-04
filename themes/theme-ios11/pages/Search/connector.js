import connect from '@shopgate/pwa-common/components/Router/helpers/connect';
import { isViewLoading } from '@shopgate/pwa-common/selectors/view';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import { getSearchPhrase } from '@shopgate/pwa-common/selectors/history';
import { getProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { isFilterBarShown } from './selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isLoading: isViewLoading(state, SEARCH_PATH),
  isFilterBarShown: isFilterBarShown(state),
  searchPhrase: getSearchPhrase(state) || '',
  ...getProductsResult(state),
});

export default connect(mapStateToProps, null, null, { withRef: true });
