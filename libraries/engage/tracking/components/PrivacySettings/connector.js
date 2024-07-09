import { connect } from 'react-redux';
import { acceptAllCookies, acceptSelectedCookies } from '../../actions';
import {
  getAreComfortCookiesAcceptedInternal,
  getAreStatisticsCookiesAcceptedInternal,
} from '../../selectors/cookieConsent';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  comfortCookiesAcceptedState: getAreComfortCookiesAcceptedInternal(state),
  statisticsCookiesAcceptedState: getAreStatisticsCookiesAcceptedInternal(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = {
  acceptAllCookies,
  acceptSelectedCookies,
};

export default connect(mapStateToProps, mapDispatchToProps);
