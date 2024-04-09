import { connect } from 'react-redux';
import { acceptAllCookies, acceptSelectedCookies } from '../../actions';
import { handleChangeComfortCookies, handleChangeStatisticsCookies } from '../../action-creators/cookieConsent';

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = {
  acceptAllCookies,
  acceptSelectedCookies,
  handleChangeComfortCookies,
  handleChangeStatisticsCookies,
};

export default connect(null, mapDispatchToProps);
