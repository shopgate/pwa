import { connect } from 'react-redux';
import { isViewLoading } from '@shopgate/pwa-common/selectors/view';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  hasResults: false,
  isLoading: isViewLoading(state, SEARCH_PATH),
});

export default connect(mapStateToProps);
