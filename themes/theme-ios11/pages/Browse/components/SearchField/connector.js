import { connect } from 'react-redux';
import {
  SCANNER_SCOPE_DEFAULT,
  SCANNER_TYPE_BARCODE,
} from '@shopgate/pwa-core/constants/Scanner';
import { scannerPath } from '@shopgate/pwa-common/constants/RoutePaths';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import { hasScannerSupport } from '@shopgate/pwa-common/selectors/client';
import fetchSearchSuggestions from '@shopgate/pwa-common-commerce/search/actions/fetchSearchSuggestions';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  hasScannerSupport: !appConfig.hasNoScanner && hasScannerSupport(state),
});

/**
 * Maps action dispatchers to the component props.
 * @param {Function} dispatch The store dispatcher.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  fetchSuggestions: query => dispatch(fetchSearchSuggestions(query)),
  submitSearch: query => dispatch(historyPush({
    pathname: `${SEARCH_PATH}?s=${encodeURIComponent(query)}`,
  })),
  openScanner: () => dispatch(historyPush({
    pathname: scannerPath(SCANNER_SCOPE_DEFAULT, SCANNER_TYPE_BARCODE),
    title: 'navigation.scanner',
  })),
});

/**
 * Connects a component to the store.
 * @param {Object} Component A react component.
 * @return {Object} The react component with extended props.
 */
export default connect(mapStateToProps, mapDispatchToProps);
