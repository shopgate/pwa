import { connect } from 'react-redux';
import { acceptAllCookies, acceptSelectedCookies } from '../../actions';

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  confirmAllCookies: () => dispatch(acceptAllCookies()),
  confirmSelectedCookies: ({
    areComfortCookiesSelected, areStatisticsCookiesSelected,
  }) => dispatch(acceptSelectedCookies({
    areComfortCookiesSelected,
    areStatisticsCookiesSelected,
  })),
});

export default connect(null, mapDispatchToProps);
