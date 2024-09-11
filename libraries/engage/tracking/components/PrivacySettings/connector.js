import { connect } from 'react-redux';
import { makeGetPrivacyPolicyLink } from '@shopgate/engage/page/selectors';
import { acceptAllCookies, acceptSelectedCookies } from '../../actions';
import {
  getAreComfortCookiesAcceptedInternal,
  getAreStatisticsCookiesAcceptedInternal,
} from '../../selectors/cookieConsent';

/**
 * @return {Object} The extended component props.
 */
const makeMapStateToProps = () => {
  const getPrivacyPolicyLink = makeGetPrivacyPolicyLink();
  return state => ({
    comfortCookiesAcceptedState: getAreComfortCookiesAcceptedInternal(state),
    statisticsCookiesAcceptedState: getAreStatisticsCookiesAcceptedInternal(state),
    privacyPolicyLink: getPrivacyPolicyLink(state),
  });
};

/**
 * Connects the dispatch function to a callable function in the props.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = {
  acceptAllCookies,
  acceptSelectedCookies,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
