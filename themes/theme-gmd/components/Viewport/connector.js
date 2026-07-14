import { connect } from 'react-redux';
import { getEnableWebIndexing } from '@shopgate/engage/settings/selectors/merchantSettings';
import { getFavicon, getGoogleSiteVerificationCode } from '@shopgate/engage/settings/selectors/shopSettings';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  enableWebIndexing: getEnableWebIndexing(state),
  favicon: getFavicon(state),
  googleSiteVerificationCode: getGoogleSiteVerificationCode(state),
});

export default connect(mapStateToProps);
