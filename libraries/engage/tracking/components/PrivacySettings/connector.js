import { connect } from 'react-redux';
import { acceptAllCookies, acceptSelectedCookies } from '../../actions';
import { getAreComfortCookiesSelected, getAreStatisticsCookiesSelected } from '../../selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  areComfortCookiesSelectedState: getAreComfortCookiesSelected(state),
  areStatisticsCookiesSelectedState: getAreStatisticsCookiesSelected(state),
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
